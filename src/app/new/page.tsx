"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowRightIcon, Loader2Icon, XIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const TIME_OPTIONS = Array.from({ length: 49 }, (_, i) => {
  const minutes = i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h < 12 || h === 24 ? "AM" : "PM";
  const display = h === 0 || h === 24 ? 12 : h > 12 ? h - 12 : h;
  return {
    value: minutes,
    label: `${display}:${m.toString().padStart(2, "0")} ${ampm}`,
  };
});

export default function NewEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState(540);
  const [endTime, setEndTime] = useState(1080);
  const [slotMinutes, setSlotMinutes] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedDays.length === 0) return;

    setLoading(true);
    const days = selectedDays
      .sort((a, b) => a.getTime() - b.getTime())
      .map((d) => format(d, "yyyy-MM-dd"));

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        days,
        startTime,
        endTime,
        slotMinutes: Number(slotMinutes),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const adminEvents = JSON.parse(localStorage.getItem("adminEvents") || "[]");
      adminEvents.push(data.slug);
      localStorage.setItem("adminEvents", JSON.stringify(adminEvents));
      router.push(`/e/${data.slug}?created=1`);
    }

    setLoading(false);
  };

  const removeDay = (day: Date) => {
    setSelectedDays((prev) => prev.filter((d) => d.getTime() !== day.getTime()));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-heading font-semibold tracking-tight">
            meetwell
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-xl mx-auto w-full px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">New event</CardTitle>
            <CardDescription>
              Set up your event and share the link with your group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">What&apos;s the event?</FieldLabel>
                  <Input
                    id="title"
                    placeholder="Team standup, Coffee chat, 1:1..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Input
                    id="description"
                    placeholder="Any context for attendees..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <FieldDescription>Optional</FieldDescription>
                </Field>

                <Separator />

                <Field>
                  <FieldLabel>Which days?</FieldLabel>
                  <div className="flex flex-col items-center rounded-lg border p-3">
                    <Calendar
                      mode="multiple"
                      selected={selectedDays}
                      onSelect={(days) => setSelectedDays(days || [])}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                  {selectedDays.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDays
                        .sort((a, b) => a.getTime() - b.getTime())
                        .map((d) => (
                          <Badge
                            key={d.toISOString()}
                            variant="secondary"
                            className="cursor-pointer gap-1"
                            onClick={() => removeDay(d)}
                          >
                            {format(d, "MMM d")}
                            <XIcon className="size-3" />
                          </Badge>
                        ))}
                    </div>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="start-time">From</FieldLabel>
                    <div className="relative">
                      <select
                        id="start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(Number(e.target.value))}
                        className="flex h-8 w-full appearance-none items-center rounded-lg border border-input bg-transparent py-2 pr-8 pl-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      >
                        {TIME_OPTIONS.filter((t) => t.value < endTime).map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="end-time">To</FieldLabel>
                    <div className="relative">
                      <select
                        id="end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(Number(e.target.value))}
                        className="flex h-8 w-full appearance-none items-center rounded-lg border border-input bg-transparent py-2 pr-8 pl-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      >
                        {TIME_OPTIONS.filter((t) => t.value > startTime).map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Slot length</FieldLabel>
                  <ToggleGroup
                    value={[slotMinutes]}
                    onValueChange={(v) => {
                      const next = v[v.length - 1];
                      if (next) setSlotMinutes(next);
                    }}
                    variant="outline"
                  >
                    <ToggleGroupItem value="15">15 min</ToggleGroupItem>
                    <ToggleGroupItem value="30">30 min</ToggleGroupItem>
                    <ToggleGroupItem value="60">1 hour</ToggleGroupItem>
                  </ToggleGroup>
                </Field>

                <Separator />

                <Button
                  type="submit"
                  size="lg"
                  disabled={!title.trim() || selectedDays.length === 0 || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2Icon data-icon="inline-start" className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create event
                      <ArrowRightIcon data-icon="inline-end" />
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
