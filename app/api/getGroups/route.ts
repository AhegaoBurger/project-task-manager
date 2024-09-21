// app/api/getGroups/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data: groups, error } = await supabase
      .from("chats")
      .select("chat_id, title, type");

    if (error) throw error;

    return NextResponse.json({ groups });
  } catch (error: any) {
    console.error("Error fetching groups:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
