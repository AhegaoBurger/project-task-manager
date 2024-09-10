import { NextResponse } from "next/server";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export async function POST(request) {
  const { chatId } = await request.json();

  const stringSession = new StringSession(""); // fill this later with the value from session.save()

  const client = new TelegramClient(
    stringSession,
    parseInt(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH,
    { connectionRetries: 5 },
  );

  await client.connect();

  try {
    const botId = await getBotId(process.env.TELEGRAM_BOT_TOKEN);

    const result = await client.invoke(
      new Api.messages.AddChatUser({
        chatId: chatId,
        userId: botId,
        fwdLimit: 43,
      }),
    );

    return NextResponse.json({ message: "Bot added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add bot to chat" },
      { status: 500 },
    );
  } finally {
    await client.disconnect();
  }
}

async function getBotId(token) {
  const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const data = await response.json();
  return data.result.id;
}
