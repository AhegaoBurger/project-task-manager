// app/api/createTask/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
// Define the Task interface (retrieved from the database)
interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string; // UUID as string
  group_id?: number; // BigInt as number
  created_by: string; // UUID as string
  due_date?: string; // Date as string in ISO format
  created_at: string;
  updated_at: string;
}

// Define the TaskInsert interface (used for inserting new tasks)
type TaskInsert = Omit<Task, "id" | "created_at" | "updated_at">;

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, assigned_to, group_id, created_by, due_date } =
    body;

  try {
    // Insert the new task into the database
    const { data, error } = await supabase
      .from("tasks")
      .insert<TaskInsert>([
        {
          title,
          description,
          assigned_to,
          group_id,
          created_by,
          due_date,
        },
      ])
      .select("*"); // This ensures 'data' contains the inserted records

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Failed to insert task");

    const task = data[0];

    // Send a message to the Telegram group if group_id is provided
    if (group_id) {
      await sendTaskNotification(task);
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendTaskNotification(task: Task) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const { title, group_id, created_by, assigned_to, due_date, id } = task;

  // Fetch creator and assignee information from Supabase
  const { data: creatorData, error: creatorError } = await supabase
    .from("profiles")
    .select("username")
    .eq("telegram_id", created_by)
    .single();

  if (creatorError) {
    throw new Error(`Error fetching creator data: ${creatorError.message}`);
  }

  let assigneeUsername = null;
  if (assigned_to) {
    const { data: assigneeData, error: assigneeError } = await supabase
      .from("profiles")
      .select("username")
      .eq("telegram_id", assigned_to)
      .single();

    if (assigneeError) {
      throw new Error(`Error fetching assignee data: ${assigneeError.message}`);
    }

    if (assigneeData) {
      assigneeUsername = assigneeData.username;
    } else {
      assigneeUsername = "Unknown User";
    }
  }

  /// Create message text with links
  const taskLink = `https://yourapp.com/tasks/${id}`;
  const creatorLink = `https://yourapp.com/profiles/${created_by}`;
  const assigneeLink = assigned_to
    ? `https://yourapp.com/profiles/${assigned_to}`
    : null;

  const createdDate = new Date().toLocaleDateString();

  let messageText = `<b>New Task Created</b>\n\n`;
  messageText += `<b>Task:</b> <a href="${taskLink}">${title}</a>\n`;
  messageText += `<b>Created By:</b> <a href="${creatorLink}">${creatorData.username}</a>\n`;
  messageText += `<b>Created Date:</b> ${createdDate}\n`;

  if (due_date) {
    const dueDateFormatted = new Date(due_date).toLocaleDateString();
    messageText += `<b>Due Date:</b> ${dueDateFormatted}\n`;
  }

  if (assigneeUsername) {
    messageText += `<b>Assignee:</b> <a href="${assigneeLink}">${assigneeUsername}</a>\n`;
  }

  // Send the message to the group
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: group_id,
      text: messageText,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}
