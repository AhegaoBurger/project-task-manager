// app/add-task/page.tsx
"use client";

import TaskForm from "@/components/TaskForm";

export default function AddTaskPage() {
  const handleTaskCreated = () => {
    // Redirect or show a success message
  };

  return (
    <div className="p-4">
      <TaskForm onTaskCreated={handleTaskCreated} />
    </div>
  );
}
