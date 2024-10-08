// app/task/[id]/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import TaskList with ssr: false
const Task = dynamic(() => import("@/components/Task"), {
  ssr: false,
});

export default function TasksPage() {
  const handleTaskCreated = () => {
    // Redirect or show a success message
  };

  return (
    <main>
      <Task />
    </main>
  );
}
