"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RespondentListProps {
  respondents: Array<{ id: string; name: string }>;
}

export function RespondentList({ respondents }: RespondentListProps) {
  if (respondents.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Responses
        </h3>
        <p className="text-sm text-muted-foreground italic">
          No responses yet. Be the first!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Responses ({respondents.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {respondents.map((r) => (
          <div key={r.id} className="flex items-center gap-1.5">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px]">
                {r.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{r.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
