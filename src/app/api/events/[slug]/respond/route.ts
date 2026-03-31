import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { name, email, slots } = await req.json();

  if (!name || !slots?.length) {
    return NextResponse.json({ error: "Name and slots required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { data: response, error } = await supabase
    .from("responses")
    .insert({
      event_id: event.id,
      name: name.trim(),
      email: email?.trim() || null,
      slots,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: response.id });
}
