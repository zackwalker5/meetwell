import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { computeHeatmap, getBestTimes } from "@/lib/heatmap";
import { EventPageClient } from "./event-page-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("slug", slug)
    .single();

  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} — meetwell`,
    description: `Add your availability for ${event.title}`,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) notFound();

  const { data: responses } = await supabase
    .from("responses")
    .select("id, name, slots")
    .eq("event_id", event.id);

  const heatmap = computeHeatmap(responses || []);
  const bestTimes = getBestTimes(heatmap);

  return (
    <EventPageClient
      event={{
        id: event.id,
        slug: event.slug,
        title: event.title,
        description: event.description,
        days: event.days,
        startTime: event.start_time,
        endTime: event.end_time,
        slotMinutes: event.slot_minutes,
      }}
      initialResponses={(responses || []).map((r) => ({
        id: r.id,
        name: r.name,
        slots: r.slots,
      }))}
      initialHeatmap={heatmap}
      initialBestTimes={bestTimes}
    />
  );
}
