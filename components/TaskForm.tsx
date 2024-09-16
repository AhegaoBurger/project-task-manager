// components/TaskForm.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TaskForm({ groupId, assignedTo, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
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
    const task = {
      title,
      description,
      assigned_to: assignedTo || null,
      group_id: groupId,
      created_by: createdBy,
      due_date: dueDate || null,
    };

    await fetch("/api/createTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    // Notify parent component
    if (onTaskCreated) {
      onTaskCreated();
    }
  };

  return (
    <div className="p-4">
      <h2>Create a New Task</h2>
      {/* Input fields */}
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2"
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2"
      />
      <input
        type="date"
        placeholder="Due Date (optional)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full mb-2"
      />
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
}
