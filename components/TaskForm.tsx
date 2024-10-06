"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import WebApp from "@twa-dev/sdk";
import { WebAppUser, WebAppInitData } from "@twa-dev/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";

interface TaskFormProps {
  groupId?: any;
  assignedTo?: any;
  onTaskCreated: () => void;
}

export default function TaskForm({
  groupId = null,
  assignedTo = null,
  onTaskCreated,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [initData, setInitData] = useState<WebAppInitData | null>(null);

  useEffect(() => {
    console.log("TaskForm mounted");
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => window.history.back());
    // Get user data from Telegram initData
    const initData = WebApp.initDataUnsafe;
    setInitData(initData);
    if (initData.user) {
      console.log("User from Telegram initData:", initData.user);
      setUser(initData?.user); // Use Telegram user ID
      createOrUpdateProfile(initData.user);
    } else {
      console.error("User not available in Telegram initData");
    }
  }, []);

  const handleCreateTask = async () => {
    console.log("Creating task");
    if (!title || !user) {
      console.error("Title and user are required");
      return;
    }

    const initData = WebApp.initData || "";

    const task = {
      title,
      description,
      assigned_to: assignedTo,
      group_id: groupId,
      created_by: user?.id,
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
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const createOrUpdateProfile = async (user: WebAppUser) => {
    try {
      const { data, error } = await supabase.from("profiles").upsert(
        {
          telegram_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          photo_url: user.photo_url,
        },
        { onConflict: "telegram_id" },
      );
      if (error) {
        console.error("Error upserting profile:", error);
      }
    } catch (error) {
      console.error("Error in createOrUpdateProfile:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 max-w-md mx-auto">
      <Card className="m-2 bg-white">
        <div className="p-4 space-y-4">
          <Input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${
                  !dueDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? (
                  format(dueDate, "PPP")
                ) : (
                  <span>Pick a due date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleCreateTask} className="w-full">
            Create Task
          </Button>
        </div>
      </Card>
    </div>
  );
}
