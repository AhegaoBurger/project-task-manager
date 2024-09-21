// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Telegraf, TelegramError, Context } from "telegraf";
import { createClient } from "@supabase/supabase-js";
import { Chat, ChatMember } from "typegram";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Keep this secret!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new Telegraf<Context>(botToken);

// Middleware to use the webhookReply (for performance)
bot.telegram.webhookReply = false;

// Ensure bot.botInfo is initialized
async function ensureBotInfo() {
  if (!bot.botInfo) {
    bot.botInfo = await bot.telegram.getMe();
  }
}

// Helper function to safely get chat title
function getChatTitle(chat: Chat): string {
  switch (chat.type) {
    case "private":
      return (
        `${(chat as any).first_name || ""} ${(chat as any).last_name || ""}`.trim() ||
        "Private Chat"
      );
    case "group":
    case "supergroup":
    case "channel":
      return (chat as any).title || "Unknown Chat";
    default:
      return "Unknown Chat";
  }
}

// Bot Logic
bot.on("my_chat_member", async (ctx) => {
  const chat = ctx.chat;
  const newStatus = ctx.update.my_chat_member.new_chat_member.status;
  const userId = ctx.update.my_chat_member.from.id; // The user who performed the action

  try {
    const title = getChatTitle(chat);

    if (newStatus === "administrator") {
      // Bot is an administrator
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        user_id: userId,
        title: title,
        type: chat.type,
        date_added: new Date(),
        is_admin: true,
      });
      console.log(`Added or updated chat: ${title} by user ID: ${userId}`);
    } else {
      // Bot is not an administrator (demoted, left, kicked)
      await supabase.from("chats").delete().eq("chat_id", chat.id);
      console.log(`Removed chat: ${title}`);
    }
  } catch (error) {
    console.error("Error updating chats:", error);
  }
});

bot.on("message", async (ctx) => {
  const chat = ctx.chat;
  try {
    await ensureBotInfo(); // Ensure bot.botInfo is initialized

    if (!bot.botInfo) {
      throw new Error("Bot info is not initialized");
    }

    if (chat.type === "private") {
      // Private chat with a user
      const title = getChatTitle(chat);
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: title,
        type: chat.type,
        date_added: new Date(),
      });
      console.log(
        `Recorded private chat with user: ${(chat as any).first_name}`,
      );
    } else if (chat.type === "group" || chat.type === "supergroup") {
      // Try to get the bot's membership status
      let chatMember: ChatMember;
      try {
        chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
      } catch (error: any) {
        if (error instanceof TelegramError && error.code === 403) {
          // Bot is not a member of the chat
          console.log(
            `Bot is not a member of the chat: ${getChatTitle(chat)}, skipping upsert`,
          );
          return; // Exit the handler
        } else {
          throw error;
        }
      }

      if (chatMember.status === "administrator") {
        // Bot is an administrator, upsert the chat
        const title = getChatTitle(chat);
        await supabase.from("chats").upsert({
          chat_id: chat.id,
          title: title,
          type: chat.type,
          date_added: new Date(),
          is_admin: true,
        });
        console.log(`Recorded group message in: ${title}`);
      } else {
        // Bot is not an administrator, do not upsert
        console.log(
          `Bot is not admin in: ${getChatTitle(chat)}, skipping upsert`,
        );
      }
    }
  } catch (error) {
    console.error("Error recording chat:", error);
  }
});

// Handle channel posts
bot.on("channel_post", async (ctx) => {
  const chat = ctx.chat;
  try {
    await ensureBotInfo(); // Ensure bot.botInfo is initialized

    if (!bot.botInfo) {
      throw new Error("Bot info is not initialized");
    }

    // Try to get the bot's membership status
    let chatMember: ChatMember;
    try {
      chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
    } catch (error: any) {
      if (error instanceof TelegramError && error.code === 403) {
        // Bot is not a member of the channel
        console.log(
          `Bot is not a member of the channel: ${getChatTitle(chat)}, skipping upsert`,
        );
        return; // Exit the handler
      } else {
        throw error;
      }
    }

    if (chatMember.status === "administrator") {
      const title = getChatTitle(chat);
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: title,
        type: chat.type,
        date_added: new Date(),
        is_admin: true,
      });
      console.log(`Recorded channel post in: ${title}`);
    } else {
      console.log(
        `Bot is not admin in channel: ${getChatTitle(chat)}, skipping upsert`,
      );
    }
  } catch (error) {
    console.error("Error recording channel:", error);
  }
});

// Webhook handler
export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    await bot.handleUpdate(update);
    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    console.error("Error handling update:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { status: "error", message: message },
      { status: 500 },
    );
  }
}
