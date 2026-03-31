import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRightIcon, CalendarPlusIcon, Link2Icon, SparklesIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function DemoGrid() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const times = ["9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p"];
  const heat = [
    [1, 3, 4, 4, 3, 2, 1, 0],
    [0, 1, 3, 4, 4, 4, 2, 0],
    [2, 4, 4, 3, 2, 1, 0, 0],
    [0, 1, 3, 4, 4, 4, 3, 1],
    [1, 2, 2, 3, 2, 1, 0, 0],
  ];

  const heatColor = (v: number) => {
    if (v === 0) return "bg-muted";
    if (v === 1) return "bg-accent/20";
    if (v === 2) return "bg-accent/40";
    if (v === 3) return "bg-accent/70";
    return "bg-accent";
  };

  return (
    <div className="flex gap-2 select-none">
      <div className="flex flex-col pt-6 gap-[3px] shrink-0">
        {times.map((t) => (
          <div key={t} className="h-[22px] flex items-center justify-end pr-1.5">
            <span className="text-[10px] text-muted-foreground font-mono">{t}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1 flex-1">
        {days.map((day, di) => (
          <div key={day} className="flex-1 flex flex-col gap-[3px]">
            <div className="h-6 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {day}
              </span>
            </div>
            {times.map((_, ti) => (
              <div
                key={ti}
                className={`h-[22px] rounded-md ${heatColor(heat[di][ti])} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-base font-heading font-semibold tracking-tight">
            meetwell
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/new">
              <Button variant="outline" size="sm">
                <CalendarPlusIcon data-icon="inline-start" />
                New event
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center px-6 pt-16 pb-24">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight leading-[1.1]">
              Group scheduling,
              <br />
              <span className="text-primary">beautifully simple.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Create an event, share the link, and watch availability fill in.
              No accounts. No back-and-forth. Just pick a time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/new">
                <Button size="lg">
                  Get started
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">Free forever</span>
            </div>
          </div>

          {/* Right — demo card */}
          <Card className="shadow-xl shadow-primary/5">
            <CardContent className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Design review</p>
                  <p className="text-xs text-muted-foreground">5 people responded</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
                  <SparklesIcon className="size-3 text-accent" />
                  <span className="text-[11px] font-medium text-accent">Best: Wed 12p</span>
                </div>
              </div>
              <DemoGrid />
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto flex flex-col gap-12">
          <h2 className="text-center text-sm uppercase tracking-widest text-muted-foreground font-medium">
            Three steps, zero friction
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: CalendarPlusIcon,
                title: "Create",
                desc: "Pick dates, set a time range, name your event. Done in seconds.",
              },
              {
                step: "02",
                icon: Link2Icon,
                title: "Share",
                desc: "Copy the link. Send it anywhere. No sign-ups for anyone.",
              },
              {
                step: "03",
                icon: SparklesIcon,
                title: "Decide",
                desc: "See the heatmap light up. The best time surfaces itself.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{item.step}</span>
                  <div className="size-8 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="size-4 text-primary" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <Card className="max-w-3xl mx-auto text-center">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <h2 className="text-2xl font-heading font-bold tracking-tight">
              Ready to find a time?
            </h2>
            <p className="text-muted-foreground max-w-sm">
              It takes 10 seconds to create an event. Really.
            </p>
            <Link href="/new">
              <Button size="lg">
                Create a free event
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            meetwell
          </span>
          <span className="text-xs text-muted-foreground">
            No ads. No tracking. Just scheduling.
          </span>
        </div>
      </footer>
    </div>
  );
}
