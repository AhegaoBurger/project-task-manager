// app/api/createTask/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, assigned_to, group_id, created_by, due_date } = body;

  try {
    // Insert the new task into the database
    const { data, error } = await supabase.from('tasks').insert([
      {
        title,
        description,
        assigned_to,
        group_id,
        created_by,
        due_date,
      },
    ]);

    if (error) throw error;

    const task = data[0];

    // Send a message to the Telegram group
    await sendTaskNotification(task);

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendTaskNotification(task) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const { title, group_id, created_by, assigned_to, due_date, id } = task;

  // Fetch creator and assignee information from Supabase
  const { data: creatorData } = await supabase
    .from('profiles')
    .select('username')
    .eq('telegram_id', created_by)
    .single();

  let assigneeUsername = null;
  if (assigned_to) {
    const { data: assigneeData } = await supabase
      .from('profiles')
      .select('username')
      .eq('telegram_id', assigned_to)
      .single();
    assigneeUsername = assigneeData?.username;
  }

  // Create message text with links
  const taskLink = `https://yourapp.com/tasks/${id}`;
  const creatorLink = `https://yourapp.com/profiles/${created_by}`;
  const assigneeLink = assigned_to ? `https://yourapp.com/profiles/${assigned_to}` : null;

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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: group_id,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
}
