"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <SunIcon className="size-4 text-muted-foreground" />
      <Switch
        checked={resolvedTheme === "dark"}
        onCheckedChange={(checked: boolean) =>
          setTheme(checked ? "dark" : "light")
        }
        size="sm"
        aria-label="Toggle dark mode"
      />
      <MoonIcon className="size-4 text-muted-foreground" />
    </div>
  );
}
