"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusIcon, MessageCircle } from "lucide-react";
import WebApp from "@twa-dev/sdk";

export default function TaskList() {
  const [isLoading, setIsLoading] = useState(true);

  WebApp.BackButton.show();
  WebApp.BackButton.onClick(() => window.history.back());

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Content */}
      <div className="flex-1 p-4">
        {/* Task Icon and Title */}
        <div className="flex items-center mb-4">
          <MessageCircle className="text-blue-500 mr-2" size={24} />
          <span className="text-xl">All</span>
        </div>

        {/* Task Filters */}
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" className="bg-gray-800 text-blue-400">
            All 0
          </Button>
          <Button variant="outline" className="bg-gray-900 text-gray-400">
            Author 0
          </Button>
          <Button variant="outline" className="bg-gray-900 text-gray-400">
            Assignee 0
          </Button>
        </div>

        {/* Add Task Button */}
        <Button variant="outline" className="w-full mb-4 justify-start">
          <PlusIcon className="mr-2" /> Add task
        </Button>

        {/* Loading or Content */}
        <Card className="bg-gray-900 p-6">
          {isLoading ? (
            <p className="text-center text-gray-400">Loading all tasks...</p>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto mb-4"
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="60" cy="60" r="58" stroke="white" strokeWidth="4" />
                <path
                  d="M35 60L55 80L85 40"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-xl font-bold mb-2">All good!</h2>
              <p className="text-gray-400">
                Add new tasks via quick-create button or open a full task
                creation form
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600">
        <PlusIcon size={24} />
      </Button>
    </div>
  );
}
