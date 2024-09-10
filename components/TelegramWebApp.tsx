"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import Image from "next/image";

export default function TelegramWebApp() {
  // const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initData, setInitData] = useState<WebAppInitData | null>(null);
  const [user, setUser] = useState<WebAppUser | null>(null);

  useEffect(() => {
    const initWebApp = () => {
      WebApp.ready();
      const initData = WebApp.initDataUnsafe;
      setInitData(initData);
      if (initData.user) {
        setUser(initData.user);
      }

      // Here you would typically send initData to your backend for validation
      // and to fetch the list of chats where the user can add the bot
      // fetchChats(initData);
    };

    initWebApp();
  }, []);

  const fetchChats = async (initData) => {
    try {
      // This would be an API call to your backend
      const response = await fetch("/api/getChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      });
      if (!response.ok) throw new Error("Failed to fetch chats");
      const data = await response.json();
      setChats(data);
    } catch (err) {
      setError("Failed to fetch chats: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleAddBot = async () => {
    if (!selectedChat) return;

    try {
      // This would be an API call to your backend
      const response = await fetch("/api/addBotToChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedChat.id,
          initData: WebApp.initData,
        }),
      });
      if (!response.ok) throw new Error("Failed to add bot");
      const result = await response.json();
      WebApp.showAlert("Bot added successfully!");
      WebApp.close();
    } catch (err) {
      setError("Failed to add bot: " + err.message);
      WebApp.showAlert("Failed to add bot: " + err.message);
    }
  };

  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!initData) return <div>Loading...</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Bot to Chat</h1>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            onClick={() => handleChatSelect(chat)}
            className={`p-2 rounded cursor-pointer ${
              selectedChat?.id === chat.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
          >
            {chat.title}
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddBot}
        disabled={!selectedChat}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Add Bot to Selected Chat
      </button>
      <div className="text-white">{user?.username}</div>
      <p>First Name: {user.first_name}</p>
      {user.last_name && <p>Last Name: {user.last_name}</p>}
      {user.username && (
        <>
          <p>Username: {user.username}</p>
          <Image
            className="mt-4"
            width={100}
            height={100}
            src={`https://t.me/${user.username}`}
            alt={`${user.first_name} ${user.last_name}`}
          />
        </>
      )}
      <h1>initData</h1>
      <pre>{JSON.stringify(initData, null, 2)}</pre>
    </div>
  );
}
