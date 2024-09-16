// app/groups/[chatId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskForm from "@/components/TaskForm";

export default function GroupMembersPage() {
  const { chatId } = useParams();
  const [members, setMembers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [assignedTo, setAssignedTo] = useState(null);

  useEffect(() => {
    if (chatId) {
      const fetchMembers = async () => {
        const response = await fetch(`/api/getGroupMembers?chatId=${chatId}`);
        const data = await response.json();
        setMembers(data.members);
      };

      fetchMembers();
    }
  }, [chatId]);

  const handleAssignTask = (userId) => {
    setAssignedTo(userId);
    setShowTaskForm(true);
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setAssignedTo(null);
    // Optionally refresh task list or show a message
  };

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
