// app/groups/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WebApp from "@twa-dev/sdk";

interface Group {
  chatId: number; // or 'string', depending on your data
  title: string;
  type: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => window.history.back());
    const fetchGroups = async () => {
      const response = await fetch("/api/getGroups");
      const data: { groups: Group[] } = await response.json();
      setGroups(data.groups);
      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <div className="p-4">
      <h1>Your Groups</h1>
      {loading ? (
        <p>Loading groups...</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.chatId}>
              <Link href={`/groups/${group.chatId}`}>
                {group.title} - {group.type}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
