"use client";

import { useState, useEffect, useCallback } from "react";
import { AvailabilityGrid } from "@/components/availability-grid";
import { BestTimeBanner } from "@/components/best-time-banner";
import { RespondentList } from "@/components/respondent-list";
import { SubmitForm } from "@/components/submit-form";
import { ShareDialog } from "@/components/share-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createClient } from "@/lib/supabase";
import { computeHeatmap, getBestTimes } from "@/lib/heatmap";
import type { HeatmapData } from "@/lib/heatmap";
import { toast } from "sonner";
import { UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

interface EventData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  days: string[];
  startTime: number;
  endTime: number;
  slotMinutes: number;
}

interface ResponseData {
  id: string;
  name: string;
  slots: string[];
}

interface EventPageClientProps {
  event: EventData;
  initialResponses: ResponseData[];
  initialHeatmap: HeatmapData;
  initialBestTimes: Array<{ slot: string; names: string[] }>;
}

export function EventPageClient({
  event,
  initialResponses,
  initialHeatmap,
  initialBestTimes,
}: EventPageClientProps) {
  const [responses, setResponses] = useState<ResponseData[]>(initialResponses);
  const [heatmap, setHeatmap] = useState<HeatmapData>(initialHeatmap);
  const [bestTimes, setBestTimes] = useState(initialBestTimes);
  const [mode, setMode] = useState<"group" | "mine">("mine");

  const recalculate = useCallback((newResponses: ResponseData[]) => {
    const newHeatmap = computeHeatmap(newResponses);
    setHeatmap(newHeatmap);
    setBestTimes(getBestTimes(newHeatmap));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`event-${event.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "responses",
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          const newResponse: ResponseData = {
            id: payload.new.id,
            name: payload.new.name,
            slots: payload.new.slots,
          };
          setResponses((prev) => {
            if (prev.some((r) => r.id === newResponse.id)) return prev;
            const updated = [...prev, newResponse];
            recalculate(updated);
            toast(`${newResponse.name} added their availability`);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [event.id, recalculate]);

  const handleSubmitted = (response: ResponseData) => {
    const updated = [...responses, response];
    setResponses(updated);
    recalculate(updated);
    setMode("group");
    toast.success("Your availability has been submitted!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-base font-heading font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors">
              whenwell
            </Link>
            <Separator orientation="vertical" className="h-5" />
            <div>
              <h1 className="font-heading font-semibold">{event.title}</h1>
              {event.description && (
                <p className="text-xs text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
          <ShareDialog slug={event.slug} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="flex flex-col gap-5">
            <BestTimeBanner
              bestTimes={bestTimes}
              respondentCount={responses.length}
            />

            <Card size="sm">
              <CardContent>
                <RespondentList
                  respondents={responses.map((r) => ({ id: r.id, name: r.name }))}
                />
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm">Add your availability</CardTitle>
              </CardHeader>
              <CardContent>
                <SubmitForm slug={event.slug} onSubmitted={handleSubmitted} />
              </CardContent>
            </Card>
          </aside>

          {/* Grid */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>
                {mode === "mine" ? "Tap your available times" : "Group heatmap"}
              </CardTitle>
              <ToggleGroup
                value={[mode]}
                onValueChange={(v) => {
                  const next = v[v.length - 1];
                  if (next === "mine" || next === "group") setMode(next);
                }}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="mine">
                  <UserIcon />
                  Mine
                </ToggleGroupItem>
                <ToggleGroupItem value="group">
                  <UsersIcon />
                  Group
                </ToggleGroupItem>
              </ToggleGroup>
            </CardHeader>
            <CardContent>
              <AvailabilityGrid
                days={event.days}
                startTime={event.startTime}
                endTime={event.endTime}
                slotMinutes={event.slotMinutes}
                heatmap={heatmap}
                respondentCount={responses.length}
                mode={mode}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
