// app/api/getGroupMembers/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${botToken}/getChatAdministrators?chat_id=${chatId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.ok) {
      const members = data.result.map((member) => ({
        userId: member.user.id,
        username: member.user.username,
        first_name: member.user.first_name,
        last_name: member.user.last_name,
      }));

      return NextResponse.json({ members });
    } else {
      return NextResponse.json({ error: data.description }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
