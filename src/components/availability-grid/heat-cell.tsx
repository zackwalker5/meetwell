"use client";

import { useGridStore } from "@/store/grid-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeatCellProps {
  slotKey: string;
  respondentCount: number;
  totalRespondents: number;
  respondentNames: string[];
  mode: "group" | "mine";
}

function getHeatClass(ratio: number): string {
  if (ratio <= 0) return "bg-muted";
  if (ratio >= 1) return "bg-accent";
  if (ratio >= 0.75) return "bg-accent/75";
  if (ratio >= 0.5) return "bg-accent/55";
  if (ratio >= 0.25) return "bg-accent/35";
  return "bg-accent/20";
}

export function HeatCell({
  slotKey,
  respondentCount,
  totalRespondents,
  respondentNames,
  mode,
}: HeatCellProps) {
  const { selectedSlots, startDrag, continueDrag } = useGridStore();
  const isSelected = selectedSlots.has(slotKey);
  const ratio = totalRespondents > 0 ? respondentCount / totalRespondents : 0;

  const cellClass = cn(
    "h-6 rounded-sm cursor-pointer select-none transition-all duration-75",
    "hover:brightness-125 hover:scale-[1.04] active:scale-95",
    mode === "mine"
      ? isSelected
        ? "bg-primary"
        : "bg-muted"
      : getHeatClass(ratio),
    isSelected && mode === "group" && "ring-1 ring-inset ring-primary/50"
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <div
            className={cellClass}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              startDrag(slotKey);
            }}
            onPointerEnter={() => continueDrag(slotKey)}
            style={{ touchAction: "none" }}
          />
        }
      />
      {respondentCount > 0 && (
        <TooltipContent side="top">
          <p className="font-semibold">
            {respondentCount}/{totalRespondents} available
          </p>
          {respondentNames.map((n) => (
            <p key={n} className="opacity-80">
              {n}
            </p>
          ))}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
