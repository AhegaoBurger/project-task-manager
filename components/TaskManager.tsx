// components/TaskManager.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PlusIcon,
  XIcon,
  ChevronRight,
  MessageCircle,
  Inbox,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  PlusCircle,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Group {
  chat_id: number;
  title: string;
  type: string;
}

interface MenuItem {
  icon: React.ReactElement;
  name: string;
  action?: string;
  href?: string;
  onClick?: () => void;
  subtext?: string;
  count?: string;
  badge?: string;
}

interface PopupItem {
  icon: React.ReactElement;
  name: string;
  subtext: string;
  href?: string;
  count?: string;
  badge?: string;
  onClick?: () => void;
}

const TaskManager = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [initData, setInitData] = useState<WebAppInitData | null>(null);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New state variables for groups
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);

  const [taskCount, setTaskCount] = useState<number>(0);
  const [taskCountLoading, setTaskCountLoading] = useState(false);
  const [taskCountError, setTaskCountError] = useState<string | null>(null);

  useEffect(() => {
    const initWebApp = () => {
      WebApp.ready();
      WebApp.expand();
      WebApp.BackButton.hide();
      const initData = WebApp.initDataUnsafe;
      if (initData.user) {
        setUser(initData.user);
      }
    };
    initWebApp();
  }, []);

  useEffect(() => {
    if (user) {
      fetchGroups();
      fetchTasks();
    }
  }, [user]);

  const fetchGroups = async () => {
    setGroupsLoading(true);
    setGroupsError(null);
    try {
      const response = await fetch(`/api/getGroups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
        }),
      });
      if (!response.ok) {
        console.log("Failed to fetch groups", await response.json());
        throw new Error("Failed to fetch groups");
      }
      const data: { groups: Group[] } = await response.json();
      setGroups(data.groups);
    } catch (err) {
      setGroupsError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setGroupsLoading(false);
    }
  };

  const fetchTasks = async () => {
    setTaskCountLoading(true);
    setTaskCountError(null);
    if (!user) return;

    try {
      setGroupsLoading(true);
      const response = await fetch(`/api/getTasks?telegram_id=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch tasks");
      }

      const data = await response.json();
      setTaskCount(data.tasks.length);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setTaskCountError(err.message);
    } finally {
      setTaskCountLoading(false);
    }
  };

  const refreshTaskCount = () => {
    fetchTasks();
  };

  const handleAddBot = () => {
    // const botUsername = "TonYarnBot"; // Dev
    const botUsername = "managingtasksbot"; // Live
    const parameter = "1";

    // This URL will work for both groups and channels
    const url = `https://t.me/${botUsername}?startgroup=${parameter}`;

    WebApp.openTelegramLink(url);
  };

  const menuItems: MenuItem[] = [
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
      name: "NEWS",
      action: "Show",
      // href: "/news", // Define the actual route
    },
    {
      icon: <PlusIcon className="w-5 h-5 text-gray-500" />,
      name: "Add task",
      href: "/add-task", // Define the actual route
    },
  ];

  const taskItems = [
    {
      icon: <Inbox className="w-5 h-5 text-blue-500" />,
      name: "All",
      count: taskCount.toString(),
    },
    {
      icon: <Inbox className="w-5 h-5 text-orange-500" />,
      name: "Inbox",
      count: 0,
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      name: "Today",
      count: 0,
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-red-500" />,
      name: "Tomorrow",
      count: 0,
    },
    {
      icon: <CalendarDays className="w-5 h-5 text-purple-500" />,
      name: "Next 7 Days",
      count: 0,
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-gray-500" />,
      name: "Completed",
      count: 0,
    },
  ];

  const popupItems: PopupItem[] = [
    {
      icon: <PlusCircle className="w-5 h-5 text-green-500" />,
      name: "New task",
      subtext: 'Quickly add a task to "Inbox" or to a custom project',
      href: "/add-task",
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-blue-500" />,
      name: "Add to group chat",
      subtext:
        "A collaborative project is created by adding the bot to a Telegram group",
      count: "1/2",
      onClick: handleAddBot,
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-orange-500" />,
      name: "New project",
      subtext:
        "Create a collection for tasks that all aim towards the same goal",
      count: "0/3",
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-purple-500" />,
      name: "New area",
      subtext:
        'A collection of projects with one theme - like "Family" or "Work"',
      badge: "Pro",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="flex items-center justify-between p-3">
          <Link href="/user">
            <div className="flex items-center">
              <Avatar className="w-8 h-8 bg-green-500 text-white">
                {user?.photo_url ? (
                  <Image
                    className="rounded-full"
                    width={32}
                    height={32}
                    src={user.photo_url}
                    alt={`${user.first_name} ${user.last_name || ""}`}
                  />
                ) : (
                  <AvatarFallback>
                    {user?.first_name?.charAt(0)}
                    {user?.last_name ? user.last_name.charAt(0) : ""}
                  </AvatarFallback>
                )}
              </Avatar>

              <span className="ml-2 font-medium text-sm">
                {user?.first_name || "User"}
              </span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
          <div className="flex items-center">
            <span className="bg-gray-200 text-blue-500 px-2 py-0.5 rounded-full text-xs">
              Free
            </span>
            <ChevronRight className="h-4 w-4 ml-1 text-blue-500" />
          </div>
        </div>
      </Card>

      {menuItems.map((item, index) => (
        <Card key={index} className="mx-2 mb-2 bg-white">
          <Link href={item.href || "#"}>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <div>
                  <span className="text-sm">{item.name}</span>
                </div>
              </div>
              {item.action ? (
                <Button variant="ghost" className="text-blue-500 px-0 text-xs">
                  {item.action}
                </Button>
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </Link>
        </Card>
      ))}

      <Card className="mx-2 mb-2 bg-white">
        <div
          className="p-3 flex items-center justify-between"
          onClick={handleAddBot}
        >
          <div className="flex items-center">
            <span className="mr-3">
              <Inbox className="w-5 h-5 text-blue-500" />
            </span>
            <div>
              <span className="text-sm">Your Groups</span>
            </div>
          </div>
          <div className="flex items-center">
            {/* Display the groups count */}
            {groupsLoading ? (
              <Skeleton className="h-4 w-4 mr-2" />
            ) : (
              <span className="text-xs text-gray-500 mr-2">
                {groups.length}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <Link href="/tasks">
          {taskItems.map((item, index) => (
            <div
              key={index}
              className="p-3 flex items-center justify-between border-b last:border-b-0"
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="flex items-center">
                {taskCountLoading ? (
                  <Skeleton className="h-4 w-4 mr-2" />
                ) : (
                  <span className="text-xs text-gray-500 mr-2">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </Link>
      </Card>

      {/* Display groups */}
      {groupsLoading && (
        <div className="space-y-2 px-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {groupsError && (
        <Alert variant="destructive" className="mx-2 my-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{groupsError}</AlertDescription>
        </Alert>
      )}

      {!groupsLoading && !groupsError && groups.length > 0 && (
        <div className="space-y-2 mx-2 mb-2">
          {groups.map((group) => (
            <Card key={group.chat_id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{group.title}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {group.type}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <DialogContent className="w-72 p-0 bg-white rounded-lg overflow-hidden mb-4">
            {popupItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick} // Add this line
                className="cursor-pointer" // Add this to show it's clickable
              >
                {item.href ? (
                  <Link href={item.href}>
                    <div className="p-3 flex items-start border-b last:border-b-0">
                      <span className="mr-3">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-900">
                            {item.name}
                          </span>
                          {item.count && (
                            <span className="text-xs text-gray-500">
                              {item.count}
                            </span>
                          )}
                          {item.badge && (
                            <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.subtext}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 flex items-start border-b last:border-b-0">
                    <span className="mr-3">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-900">
                          {item.name}
                        </span>
                        {item.count && (
                          <span className="text-xs text-gray-500">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.subtext}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </DialogContent>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPopupOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskManager;
