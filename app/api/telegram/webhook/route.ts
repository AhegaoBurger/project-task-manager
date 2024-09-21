// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Telegraf } from "telegraf";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new Telegraf(botToken);

// Middleware to use the webhookReply (for performance)
bot.telegram.webhookReply = false;

// Bot Logic
bot.on("my_chat_member", async (ctx) => {
  const chat = ctx.chat;
  const newStatus = ctx.update.my_chat_member.new_chat_member.status;
  try {
    if (newStatus === "administrator") {
      // Bot is an administrator
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: chat.title || `${chat.first_name} ${chat.last_name || ""}`,
        type: chat.type,
        date_added: new Date(),
        is_admin: true,
      });
      console.log(`Added or updated chat: ${chat.title || chat.first_name}`);
    } else {
      // Bot is not an administrator (demoted, left, kicked)
      await supabase.from("chats").delete().eq("chat_id", chat.id);
      console.log(`Removed chat: ${chat.title || chat.first_name}`);
    }
  } catch (error) {
    console.error("Error updating chats:", error);
  }
});

bot.on("message", async (ctx) => {
  const chat = ctx.chat;
  try {
    if (chat.type === "private") {
      // Private chat with a user
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: `${chat.first_name} ${chat.last_name || ""}`,
        type: chat.type,
        date_added: new Date(),
      });
      console.log(`Recorded private chat with user: ${chat.first_name}`);
    } else if (chat.type === "group" || chat.type === "supergroup") {
      // Try to get the bot's membership status
      let chatMember;
      try {
        chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
      } catch (error: any) {
        if (error.response && error.response.error_code === 403) {
          // Bot is not a member of the chat
          console.log(
            `Bot is not a member of the chat: ${chat.title}, skipping upsert`,
          );
          return; // Exit the handler
        } else {
          throw error;
        }
      }

      if (chatMember.status === "administrator") {
        // Bot is an administrator, upsert the chat
        await supabase.from("chats").upsert({
          chat_id: chat.id,
          title: chat.title,
          type: chat.type,
          date_added: new Date(),
          is_admin: true,
        });
        console.log(`Recorded group message in: ${chat.title}`);
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
    // Try to get the bot's membership status
    let chatMember;
    try {
      chatMember = await ctx.telegram.getChatMember(chat.id, bot.botInfo.id);
    } catch (error: any) {
      if (error.response && error.response.error_code === 403) {
        // Bot is not a member of the channel
        console.log(
          `Bot is not a member of the channel: ${chat.title}, skipping upsert`,
        );
        return; // Exit the handler
      } else {
        throw error;
      }
    }

    if (chatMember.status === "administrator") {
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: chat.title,
        type: chat.type,
        date_added: new Date(),
        is_admin: true,
      });
      console.log(`Recorded channel post in: ${chat.title}`);
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
      { status: "error", message: error.message },
      { status: 500 },
    );
  }
}
