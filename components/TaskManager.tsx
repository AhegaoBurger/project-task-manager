"use client";

import React, { useState } from "react";
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
} from "lucide-react";

const TaskManager = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const menuItems = [
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
      name: "UTASKS NEWS",
      action: "Show",
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-green-500" />,
      name: "Add to group chat",
      subtext:
        "A collaborative project is created by adding the bot to a Telegram group",
      count: "1/2",
    },
    { icon: <PlusIcon className="w-5 h-5 text-gray-500" />, name: "Add task" },
  ];

  const taskItems = [
    {
      icon: <Inbox className="w-5 h-5 text-blue-500" />,
      name: "All",
      count: "2",
    },
    {
      icon: <Inbox className="w-5 h-5 text-orange-500" />,
      name: "Inbox",
      count: "1",
    },
    {
      icon: <Calendar className="w-5 h-5 text-green-500" />,
      name: "Today",
      count: "2",
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-red-500" />,
      name: "Tomorrow",
      count: "0",
    },
    {
      icon: <CalendarDays className="w-5 h-5 text-purple-500" />,
      name: "Next 7 Days",
      count: "0",
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-gray-500" />,
      name: "Completed",
      count: "2",
    },
  ];

  const popupItems = [
    {
      icon: <PlusCircle className="w-5 h-5 text-green-500" />,
      name: "New task",
      subtext: 'Quickly add a task to "Incoming" or to a custom project',
    },
    {
      icon: <PlusCircle className="w-5 h-5 text-blue-500" />,
      name: "Add to group chat",
      subtext:
        "A collaborative project is created by adding the bot to a Telegram group",
      count: "1/2",
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
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Avatar className="w-8 h-8 bg-green-500 text-white">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium text-sm">Artur</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </div>
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
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              <div>
                <span className="text-sm">{item.name}</span>
                {item.subtext && (
                  <p className="text-xs text-gray-500 mt-0.5">{item.subtext}</p>
                )}
              </div>
            </div>
            {item.count && (
              <span className="text-xs text-gray-500">{item.count}</span>
            )}
            {item.action && (
              <Button variant="ghost" className="text-blue-500 px-0 text-xs">
                {item.action}
              </Button>
            )}
            {!item.action && <ChevronRight className="h-4 w-4 text-gray-400" />}
          </div>
        </Card>
      ))}

      <Card className="mx-2 mb-2 bg-white">
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
              <span className="text-xs text-gray-500 mr-2">{item.count}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </Card>

      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
          <DialogContent className="w-72 p-0 bg-white rounded-lg overflow-hidden mb-4">
            {popupItems.map((item, index) => (
              <div
                key={index}
                className="p-3 flex items-start border-b last:border-b-0"
              >
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
                  <p className="text-xs text-gray-500 mt-0.5">{item.subtext}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
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
