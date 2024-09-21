// app/api/getGroups/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const { data: groups, error } = await supabase
      .from("chats")
      .select("chat_id, title, type")
      .eq("user_id", user_id);

    if (error) throw error;

    return NextResponse.json({ groups });
  } catch (error: any) {
    console.error("Error fetching groups:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
