import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateSlug } from "@/lib/slug";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, days, startTime, endTime, slotMinutes = 30 } = body;

  if (!title || !days?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const slug = generateSlug(title);
  const supabase = await createServerSupabaseClient();

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      slug,
      title,
      description: description || null,
      days,
      start_time: startTime,
      end_time: endTime,
      slot_minutes: slotMinutes,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("slug, id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug: event.slug, id: event.id });
}
