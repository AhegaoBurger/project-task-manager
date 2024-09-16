// app/api/getGroups/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract chat IDs where the bot is an admin
    const groups = data.result
      .filter(
        (update: any) =>
          update.message &&
          update.message.chat.type.endsWith('group') &&
          update.message.from.is_bot === false
      )
      .map((update: any) => ({
        chatId: update.message.chat.id,
        title: update.message.chat.title,
        type: update.message.chat.type,
      }));

    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
