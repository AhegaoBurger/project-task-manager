"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import WebApp from "@twa-dev/sdk";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Group {
  chatId: number; // or 'string', depending on your data
  title: string;
  type: string;
}

export default function GroupsPageComponent() {
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
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="flex items-center p-3">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Your Groups</h1>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        {loading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          groups.map((group) => (
            <Link key={group.chatId} href={`/groups/${group.chatId}`}>
              <div className="p-3 flex items-center justify-between border-b last:border-b-0">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <span className="text-sm font-medium">{group.title}</span>
                    <p className="text-xs text-gray-500">{group.type}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Link>
          ))
        )}
      </Card>
    </div>
  );
}
