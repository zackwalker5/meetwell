import { ImageResponse } from "next/og";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("slug", slug)
    .single();

  const { count } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq(
      "event_id",
      (
        await supabase.from("events").select("id").eq("slug", slug).single()
      ).data?.id || ""
    );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#09090b",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f4f4f5",
            marginBottom: 16,
          }}
        >
          {event?.title ?? "Event"}
        </div>
        <div style={{ fontSize: 28, color: "#71717a" }}>
          {count ?? 0} responses &middot; whenwell
        </div>
      </div>
    )
  );
}
