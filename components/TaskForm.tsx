"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import WebApp from "@twa-dev/sdk";
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
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => window.history.back());
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setCreatedBy(user.user_metadata.telegram_id);
      } else {
        console.error("User not authenticated");
      }
    };
    getUser();
  }, []);

  const handleCreateTask = async () => {
    if (!title || !createdBy) {
      console.error("Title and createdBy are required");
      return;
    }

    const task = {
      title,
      description,
      assigned_to: assignedTo,
      group_id: groupId,
      created_by: createdBy,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
    };

    try {
      await fetch("/api/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
          <h2 className="text-lg font-semibold">Create a New Task</h2>
        </div>
      </Card>

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
