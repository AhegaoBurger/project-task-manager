// app/groups/[chatId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskForm from "@/components/TaskForm";

interface Member {
  userId: number; // or 'string', depending on your data
  username: string;
  first_name: string;
  last_name: string;
}

export default function GroupMembersPage() {
  const params = useParams();
  const chatId = params.chatId;

  // Move all Hooks to the top level
  const [members, setMembers] = useState<Member[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [assignedTo, setAssignedTo] = useState<number | null>(null);

  useEffect(() => {
    // Handle the case where chatId is undefined or not a string
    if (!chatId || typeof chatId !== "string") {
      return;
    }

    const fetchMembers = async () => {
      const response = await fetch(`/api/getGroupMembers?chatId=${chatId}`);
      const data = await response.json();
      setMembers(data.members);
    };

    fetchMembers();
  }, [chatId]);

  const handleAssignTask = (userId: number) => {
    setAssignedTo(userId);
    setShowTaskForm(true);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setAssignedTo(null);
    // Optionally refresh task list or show a message
  };

  // Move the conditional rendering after the Hooks
  if (!chatId || typeof chatId !== "string") {
    return <div>No chatId provided</div>;
  }

  return (
    <div className="p-4">
      <h1>Group Members</h1>
      <ul>
        {members.map((member) => (
          <li key={member.userId}>
            {member.first_name} {member.last_name} (@{member.username})
            <button onClick={() => handleAssignTask(member.userId)}>
              Assign Task
            </button>
          </li>
        ))}
      </ul>
      {showTaskForm && (
        <TaskForm
          groupId={chatId}
          assignedTo={assignedTo}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
