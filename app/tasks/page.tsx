// app/tasks/page.tsx
import dynamic from "next/dynamic";

// Dynamically import TaskList with ssr: false
const TaskList = dynamic(() => import("@/components/TaskList"), { ssr: false });

export default function TasksPage() {
  return (
    <main>
      <TaskList />
    </main>
  );
}
