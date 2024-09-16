// app/page.tsx
import dynamic from "next/dynamic";

// Dynamically import UserProfile with ssr: false
const TaskManager = dynamic(() => import("@/components/TaskManager"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <TaskManager />
    </main>
  );
}
