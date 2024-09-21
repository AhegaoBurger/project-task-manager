// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Telegraf, Context } from "telegraf";
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

// Bot Logic
bot.on("my_chat_member", async (ctx) => {
  const chat = ctx.chat;
  const newChatMember = ctx.update.my_chat_member.new_chat_member;
  try {
    if (["administrator", "member"].includes(newChatMember.status)) {
      // Bot was added or promoted
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: chat.title || `${chat.first_name} ${chat.last_name || ""}`,
        type: chat.type,
        date_added: new Date(),
        is_admin: newChatMember.status === "administrator",
      });
      console.log(`Added or updated chat: ${chat.title || chat.first_name}`);
    } else if (["left", "kicked"].includes(newChatMember.status)) {
      // Bot was removed
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
      // Message in a group or supergroup
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: chat.title,
        type: chat.type,
        date_added: new Date(),
      });
      console.log(`Recorded group message in: ${chat.title}`);
    }
    // You can add more message handling logic here
  } catch (error) {
    console.error("Error recording chat:", error);
  }
});

// Handle channel posts
bot.on("channel_post", async (ctx) => {
  const chat = ctx.chat;
  try {
    if (chat.type === "channel") {
      await supabase.from("chats").upsert({
        chat_id: chat.id,
        title: chat.title,
        type: chat.type,
        date_added: new Date(),
      });
      console.log(`Recorded channel post in: ${chat.title}`);
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
