// app/add-task/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import UserProfile with ssr: false
const TaskForm = dynamic(() => import("@/components/TaskForm"), {
  ssr: false,
});

export default function AddTaskPage() {
  const handleTaskCreated = () => {
    // Redirect or show a success message
  };

  return (
    <div className="">
      <TaskForm onTaskCreated={handleTaskCreated} />
    </div>
  );
}
