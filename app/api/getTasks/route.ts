// app/api/getTasks/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { data: tasks, error } = await supabase.from("tasks").select("*");

    if (error) throw error;

    return NextResponse.json({ tasks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
