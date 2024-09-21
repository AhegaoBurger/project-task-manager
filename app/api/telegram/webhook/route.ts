// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Telegraf, Context, TelegramError } from "telegraf";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Keep this secret!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new Telegraf(botToken);

// Middleware to use the webhookReply (for performance)
bot.telegram.webhookReply = false;

// Ensure bot.botInfo is initialized
async function ensureBotInfo() {
  if (!bot.botInfo) {
    bot.botInfo = await bot.telegram.getMe();
  }
}

// Bot Logic
bot.on("my_chat_member", async (ctx) => {
  const chat = ctx.chat;
  const newStatus = ctx.update.my_chat_member.new_chat_member.status;
  const userId = ctx.update.my_chat_member.from.id; // The user who performed the action
  try {
    let title: string;
    if (chat.type === "private") {
      title = `${chat.first_name} ${chat.last_name || ""}`;
    } else if (
      chat.type === "group" ||
      chat.type === "supergroup" ||
      chat.type === "channel"
    ) {
      title = chat.title;
    } else {
      title = "Unknown Chat";
    }

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

    if (chat.type === "private") {
      // Private chat with a user
      const title = `${chat.first_name} ${chat.last_name || ""}`;
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: title,
        type: chat.type,
        date_added: new Date(),
      });
      console.log(`Recorded private chat with user: ${chat.first_name}`);
    } else if (chat.type === "group" || chat.type === "supergroup") {
      // Try to get the bot's membership status
      let chatMember;
      try {
        chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
      } catch (error) {
        if (error instanceof TelegramError && error.code === 403) {
          // Bot is not a member of the chat
          console.log(
            `Bot is not a member of the chat: ${
              (chat as any).title || "Unknown Chat"
            }, skipping upsert`,
          );
          return; // Exit the handler
        } else {
          throw error;
        }
      }

      if (chatMember.status === "administrator") {
        // Bot is an administrator, upsert the chat
        const title = chat.title;
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
        console.log(`Bot is not admin in: ${chat.title}, skipping upsert`);
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

    // Try to get the bot's membership status
    let chatMember;
    try {
      chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
    } catch (error) {
      if (error instanceof TelegramError && error.code === 403) {
        // Bot is not a member of the channel
        console.log(
          `Bot is not a member of the channel: ${
            (chat as any).title || "Unknown Channel"
          }, skipping upsert`,
        );
        return; // Exit the handler
      } else {
        throw error;
      }
    }

    if (chatMember.status === "administrator") {
      const title = chat.title;
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
        `Bot is not admin in channel: ${chat.title}, skipping upsert`,
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
  } catch (error) {
    console.error("Error handling update:", error);
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 },
    );
  }
}
