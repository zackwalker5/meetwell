import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { computeHeatmap, getBestTimes } from "@/lib/heatmap";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: responses } = await supabase
    .from("responses")
    .select("id, name, slots, email")
    .eq("event_id", event.id);

  const heatmap = computeHeatmap(responses || []);
  const bestTimes = getBestTimes(heatmap);

  return NextResponse.json({
    event: {
      id: event.id,
      slug: event.slug,
      title: event.title,
      description: event.description,
      days: event.days,
      startTime: event.start_time,
      endTime: event.end_time,
      slotMinutes: event.slot_minutes,
    },
    responses: (responses || []).map((r) => ({
      id: r.id,
      name: r.name,
      slots: r.slots,
    })),
    heatmap,
    bestTimes,
    respondentCount: responses?.length || 0,
  });
}
