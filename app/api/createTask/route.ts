// app/api/createTask/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  group_id: number;
  created_by: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

type TaskInsert = Omit<Task, "id" | "created_at" | "updated_at">;

export async function POST(request: Request) {
  console.log("POST request received in createTask route");
  const body = await request.json();
  console.log("Request body:", body);

  const { title, description, assigned_to, group_id, created_by, due_date } =
    body;

  try {
    console.log("Attempting to insert task into database");
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
      .select("*");

    if (error) {
      console.error("Error inserting task:", error);
      throw error;
    }
    if (!data || data.length === 0) {
      console.error("Failed to insert task: No data returned");
      throw new Error("Failed to insert task");
    }

    const task = data[0];
    console.log("Task inserted successfully:", task);

    if (group_id) {
      console.log("Sending task notification for group_id:", group_id);
      await sendTaskNotification(task);
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error("Error in createTask route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendTaskNotification(task: Task) {
  console.log("Sending task notification for task:", task);
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const { title, group_id, created_by, assigned_to, due_date, id } = task;

  try {
    console.log("Fetching creator data for created_by:", created_by);
    const { data: creatorData, error: creatorError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", created_by)
      .single();

    if (creatorError) {
      console.error("Error fetching creator data:", creatorError);
      throw new Error(`Error fetching creator data: ${creatorError.message}`);
    }

    console.log("Creator data:", creatorData);

    let assigneeUsername = null;
    if (assigned_to) {
      console.log("Fetching assignee data for assigned_to:", assigned_to);
      const { data: assigneeData, error: assigneeError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", assigned_to)
        .single();

      if (assigneeError) {
        console.error("Error fetching assignee data:", assigneeError);
        throw new Error(
          `Error fetching assignee data: ${assigneeError.message}`,
        );
      }

      if (assigneeData) {
        assigneeUsername = assigneeData.username;
      } else {
        assigneeUsername = "Unknown User";
      }

      console.log("Assignee data:", assigneeData);
    }

    // Create message text with links
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

    console.log("Sending Telegram message with text:", messageText);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: group_id,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const responseData = await response.json();
    console.log("Telegram API response:", responseData);

    if (!response.ok) {
      throw new Error(`Telegram API error: ${responseData.description}`);
    }
  } catch (error) {
    console.error("Error in sendTaskNotification:", error);
    throw error;
  }
}
