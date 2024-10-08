// app/api/getTasks/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const telegram_id = searchParams.get("telegram_id");

    if (!telegram_id) {
      return NextResponse.json(
        { error: "Telegram ID is required" },
        { status: 400 },
      );
    }

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("created_by", telegram_id);
    if (error) throw error;

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
