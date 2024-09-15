"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon, XIcon, ChevronRightIcon } from "lucide-react";

const TaskManager = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const menuItems = [
    { icon: "📢", name: "UTASKS NEWS", action: "Show" },
    {
      icon: "👥",
      name: "Add to group chat",
      subtext:
        "A collaborative project is created by adding the bot to a Telegram group",
      count: "1/2",
    },
    { icon: "➕", name: "Add task" },
    { icon: "🔵", name: "All", count: "0" },
    { icon: "📥", name: "Inbox", count: "0" },
  ];

  const popupItems = [
    {
      icon: "🟢",
      name: "New task",
      subtext: 'Quickly add a task to "Incoming" or to a custom project',
    },
    {
      icon: "👥",
      name: "Add to group chat",
      subtext:
        "A collaborative project is created by adding the bot to a Telegram group",
      count: "1/2",
    },
    {
      icon: "📁",
      name: "New project",
      subtext:
        "Create a collection for tasks that all aim towards the same goal",
      count: "0/3",
    },
    {
      icon: "📚",
      name: "New area",
      subtext:
        'A collection of projects with one theme - like "Family" or "Work"',
      badge: "Pro",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" className="text-blue-400">
          Close
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold">UTasks | Task Manager</h1>
          <p className="text-xs text-gray-400">mini app</p>
        </div>
        <Button variant="ghost" size="icon">
          ...
        </Button>
      </header>

      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold mr-3">
          A
        </div>
        <span>Artur</span>
        <ChevronRightIcon className="ml-1 h-4 w-4" />
        <span className="ml-auto bg-gray-800 text-blue-400 px-3 py-1 rounded-full text-sm">
          Free
        </span>
        <ChevronRightIcon className="ml-1 h-4 w-4 text-blue-400" />
      </div>

      <Card className="flex-1 overflow-y-auto bg-black border-none">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="p-4 border-b border-gray-800 flex items-center"
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span>{item.name}</span>
                {item.count && (
                  <span className="text-gray-500">{item.count}</span>
                )}
                {item.action && (
                  <Button variant="ghost" className="text-blue-400">
                    {item.action}
                  </Button>
                )}
              </div>
              {item.subtext && (
                <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
              )}
            </div>
            {!item.action && <ChevronRightIcon className="text-gray-500" />}
          </div>
        ))}
      </Card>

      {isPopupOpen && (
        <Card className="absolute bottom-20 left-4 right-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          {popupItems.map((item, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-800 flex items-center"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span>{item.name}</span>
                  {item.count && (
                    <span className="text-gray-500">{item.count}</span>
                  )}
                  {item.badge && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
              </div>
              <ChevronRightIcon className="text-gray-500" />
            </div>
          ))}
        </Card>
      )}

      <div className="p-4 flex justify-end">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsPopupOpen(!isPopupOpen)}
        >
          {isPopupOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <PlusIcon className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskManager;
