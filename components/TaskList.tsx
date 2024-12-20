"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  Calendar as CalendarIcon,
  RotateCw,
  Flag,
  Inbox,
  Paperclip,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

interface TaskFormProps {
  groupId?: any;
  assignedTo?: any;
  onTaskCreated: () => void;
}

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

export default function TaskList({
  groupId = null,
  assignedTo = null,
  onTaskCreated,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [initData, setInitData] = useState<WebAppInitData | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  // const longPressDuration = 500; // milliseconds
  // const [isLongPress, setIsLongPress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => window.history.back());

    const initData = WebApp.initDataUnsafe;
    setInitData(initData);
    if (initData.user) {
      console.log("User from Telegram initData:", initData.user);
      setUser(initData.user);
    } else {
      console.error("User not available in Telegram initData");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
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
      setTasks(data.tasks);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setIsAddingTask(!isAddingTask);
    setNewTask({ title: "", description: "" });
    setError(null);
  };

  const handleCloseAddTask = () => {
    setIsAddingTask(false);
    setNewTask({ title: "", description: "" });
    setError(null);
  };

  const handleCreateTask = async () => {
    console.log("Creating task");
    if (!newTask.title.trim() || !user) {
      console.error("Title and user are required");
      setError("Title is required.");
      return;
    }

    const initData = WebApp.initData || "";

    const task = {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      assigned_to: assignedTo,
      group_id: groupId,
      created_by: user.id,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      initData,
    };

    console.log("Task data:", task);

    try {
      const response = await fetch("/api/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      console.log("Task created successfully");

      setTasks((prevTasks) => [data.task, ...prevTasks]);
      setIsAddingTask(false);
      setNewTask({ title: "", description: "" });
      setError(null);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/deleteTask?id=${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    }
  };

  const trailingActions = (taskId: string) => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={() => handleDeleteTask(taskId)}>
        <div className="flex items-center justify-end bg-red-500 text-white px-4 h-full">
          <Trash2 className="h-6 w-6" />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 mx-2 mb-2 bg-white">
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

          {isAddingTask ? (
            <Card className="mb-4">
              <div className="p-4 space-y-4">
                <div className="flex items-center">
                  <X
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTask({ title: "", description: "" });
                    }}
                  />
                  <Input
                    className="ml-2 flex-grow"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                  />
                </div>
                <Textarea
                  placeholder="Description..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <div className="flex items-center text-gray-500">
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span>Attach files</span>
                  <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-1 rounded">
                    Pro
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span
                          className={`flex items-center ${
                            !dueDate && "text-gray-500"
                          }`}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {dueDate ? format(dueDate, "PPP") : "Today"}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <RotateCw className="h-4 w-4 mr-2" />
                    <span>Repeat</span>
                  </div>
                  <span className="text-gray-500">Set specific time</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Flag className="h-4 w-4 mr-2" />
                  <span>Date due</span>
                  <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-1 rounded">
                    Pro
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Inbox className="h-4 w-4 mr-2" />
                    <span>Project</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500">Inbox</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreateTask}>
                  Create
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start mb-4"
              onClick={handleAddTask}
            >
              <Plus className="mr-2 h-4 w-4" /> Add task
            </Button>
          )}

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
            <SwipeableList type={Type.IOS}>
              {tasks.map((task) => (
                <SwipeableListItem
                  key={task.id}
                  trailingActions={trailingActions(task.id)}
                >
                  <div
                    className="w-full h-full mb-4 p-4 bg-white rounded shadow hover:shadow-md transition-shadow cursor-pointer relative"
                    onClick={() => router.push(`/task/${task.id}`)}
                  >
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-600">{task.description}</p>
                    )}
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <span>
                        Due:{" "}
                        {new Date(task.due_date || "").toLocaleDateString()}
                      </span>
                      <span>
                        Created:{" "}
                        {new Date(task.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </SwipeableListItem>
              ))}
            </SwipeableList>
          )}
        </div>
      </Card>

      <div className="fixed bottom-4 right-4">
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white"
          asChild
        >
          <Link href="/add-task">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
