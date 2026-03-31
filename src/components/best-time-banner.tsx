"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { minutesToLabel } from "@/lib/time";
import { ClockIcon } from "lucide-react";

interface BestTimeBannerProps {
  bestTimes: Array<{ slot: string; names: string[] }>;
  respondentCount: number;
}

function formatSlot(slot: string): string {
  const [datePart, timePart] = slot.split("T");
  const date = new Date(datePart + "T00:00:00");
  const dayStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const [h, m] = timePart.split(":").map(Number);
  const timeStr = minutesToLabel(h * 60 + m);
  return `${dayStr} at ${timeStr}`;
}

export function BestTimeBanner({
  bestTimes,
  respondentCount,
}: BestTimeBannerProps) {
  if (bestTimes.length === 0 || respondentCount === 0) return null;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ClockIcon className="size-4 text-accent" />
          Best Times
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {bestTimes.map((bt) => (
          <div key={bt.slot} className="flex items-center justify-between gap-2">
            <span className="text-sm">{formatSlot(bt.slot)}</span>
            <Badge variant="secondary">
              {bt.names.length}/{respondentCount}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
