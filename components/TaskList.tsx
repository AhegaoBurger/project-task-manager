"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Calendar,
  RotateCw,
  Flag,
  Inbox,
} from "lucide-react";
import WebApp from "@twa-dev/sdk";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  assigned_to?: string | null;
  group_id?: number | null;
  created_by: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  category?: string;
}

export default function TaskList() {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => window.history.back());

    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/getTasks", {
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
        setTasks(data.tasks);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">UTasks | Task Manager</h1>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      <Card className="mx-2 mb-2 bg-white">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">All</h2>
          <div className="flex space-x-2 mb-4">
            <Button variant="outline" className="bg-gray-100">
              All {tasks.length}
            </Button>
            <Button variant="outline" className="bg-gray-100">
              Author {tasks.length}
            </Button>
            <Button variant="outline" className="bg-gray-100">
              Assignee {tasks.length}
            </Button>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" /> Add task
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Today</span>
                </div>
                <div className="flex items-center">
                  <RotateCw className="mr-2 h-4 w-4" />
                  <span>Repeat</span>
                </div>
                <div className="flex items-center">
                  <Flag className="mr-2 h-4 w-4" />
                  <span className="text-purple-600">Date due</span>
                  <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-1 rounded">
                    Pro
                  </span>
                </div>
                <div className="flex items-center">
                  <Inbox className="mr-2 h-4 w-4" />
                  <span>Inbox</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {isLoading ? (
            <p className="text-center mt-4">Loading tasks...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-4">{error}</p>
          ) : tasks.length === 0 ? (
            <div className="text-center">
              <svg
                className="mx-auto mb-4"
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="60" cy="60" r="58" stroke="grey" strokeWidth="4" />
                <path
                  d="M35 60L55 80L85 40"
                  stroke="grey"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-xl font-bold mb-2">All good!</h2>
              <p className="">
                Add new tasks via quick-create button or open a full task
                creation form
              </p>
            </div>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="mb-4 p-4 bg-white rounded shadow">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600">{task.description}</p>
                  )}
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>
                      Due: {new Date(task.due_date || "").toLocaleDateString()}
                    </span>
                    <span>
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      <div className="fixed bottom-4 right-4">
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
