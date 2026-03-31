"use client";

import { useGridStore } from "@/store/grid-store";
import { HeatCell } from "./heat-cell";
import { minutesToLabel, generateSlots } from "@/lib/time";
import type { HeatmapData } from "@/lib/heatmap";

interface AvailabilityGridProps {
  days: string[];
  startTime: number;
  endTime: number;
  slotMinutes: number;
  heatmap: HeatmapData;
  respondentCount: number;
  mode: "group" | "mine";
}

export function AvailabilityGrid({
  days,
  startTime,
  endTime,
  slotMinutes,
  heatmap,
  respondentCount,
  mode,
}: AvailabilityGridProps) {
  const { endDrag } = useGridStore();
  const slots = generateSlots(days, startTime, endTime, slotMinutes);
  const timeLabels: number[] = [];
  for (let t = startTime; t < endTime; t += slotMinutes) timeLabels.push(t);

  const dayHeaders = days.map((d) => {
    const date = new Date(d + "T00:00:00");
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      iso: d,
    };
  });

  return (
    <div
      className="flex gap-3 select-none"
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Time axis */}
      <div className="flex flex-col pt-9 gap-0.5 shrink-0">
        {timeLabels.map((t) => (
          <div key={t} className="h-6 flex items-center justify-end pr-2">
            <span className="text-[9px] text-muted-foreground font-mono whitespace-nowrap">
              {minutesToLabel(t)}
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex gap-1.5 flex-1">
        {dayHeaders.map((dh) => (
          <div key={dh.iso} className="flex-1 flex flex-col gap-0.5">
            {/* Header */}
            <div className="h-9 flex flex-col items-center justify-center shrink-0">
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold font-mono">
                {dh.day}
              </span>
              <span className="text-[9px] text-muted-foreground/60 font-mono">
                {dh.date.split(" ")[1]}
              </span>
            </div>
            {/* Cells */}
            {timeLabels.map((_, ti) => {
              const slotKey = slots[days.indexOf(dh.iso) * timeLabels.length + ti];
              const names = heatmap[slotKey] || [];
              return (
                <HeatCell
                  key={slotKey}
                  slotKey={slotKey}
                  respondentCount={names.length}
                  totalRespondents={respondentCount}
                  respondentNames={names}
                  mode={mode}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
