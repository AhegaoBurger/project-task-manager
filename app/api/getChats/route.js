import { NextResponse } from "next/server";
import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export async function POST(request) {
  const { initData } = await request.json();

  if (!validateInitData(initData)) {
    return NextResponse.json({ error: "Invalid init data" }, { status: 400 });
  }

  const stringSession = new StringSession(""); // fill this later with the value from session.save()

  const client = new TelegramClient(
    stringSession,
    parseInt(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH,
    { connectionRetries: 5 },
  );

  await client.connect();

  try {
    const result = await client.invoke(
      new Api.messages.GetDialogs({
        offsetDate: 0,
        offsetId: 0,
        offsetPeer: new Api.InputPeerEmpty(),
        limit: 50,
        hash: 0,
      }),
    );

    console.log("Result: ", result);

    const chats = result.chats
      .filter(
        (chat) => chat.className === "Channel" || chat.className === "Chat",
      )
      .map((chat) => ({ id: chat.id, title: chat.title }));

    console.log("Chats: ", chats);

    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  } finally {
    await client.disconnect();
  }
}
