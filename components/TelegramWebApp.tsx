"use client";
import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon, ChevronRightIcon } from "lucide-react";

export default function TelegramWebApp() {
  const [initData, setInitData] = useState<WebAppInitData | null>(null);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initWebApp = () => {
      WebApp.ready();
      const initData = WebApp.initDataUnsafe;
      setInitData(initData);
      if (initData.user) {
        setUser(initData.user);
      }
    };
    initWebApp();
  }, []);

  const handleAddBot = () => {
    const botUsername = "TonYarnBot"; // Replace with your actual bot username
    const parameter = "1";

    // This URL will work for both groups and channels
    const url = `https://t.me/${botUsername}?startgroup=${parameter}`;

    // console.log("URL: ", url);

    WebApp.openTelegramLink(url);
  };

  if (error) return <div>Error: {error}</div>;
  if (!initData) return <div>Loading...</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Bot to Chat</h1>
      <button
        onClick={handleAddBot}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Bot to a Group or Channel
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
