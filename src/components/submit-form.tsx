"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGridStore } from "@/store/grid-store";
import { SendIcon, Loader2Icon } from "lucide-react";

interface SubmitFormProps {
  slug: string;
  onSubmitted: (response: { id: string; name: string; slots: string[] }) => void;
}

export function SubmitForm({ slug, onSubmitted }: SubmitFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectedSlots, clearSelection } = useGridStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedSlots.size === 0) return;

    setLoading(true);
    const slots = Array.from(selectedSlots);

    const res = await fetch(`/api/events/${slug}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slots }),
    });

    if (res.ok) {
      const data = await res.json();
      onSubmitted({ id: data.id, name: name.trim(), slots });
      setName("");
      clearSelection();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field>
        <FieldLabel htmlFor="respondent-name">Your name</FieldLabel>
        <Input
          id="respondent-name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Button
        type="submit"
        disabled={!name.trim() || selectedSlots.size === 0 || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
            Submitting...
          </>
        ) : selectedSlots.size === 0 ? (
          "Select your available times"
        ) : (
          <>
            <SendIcon data-icon="inline-start" />
            Submit {selectedSlots.size} slot{selectedSlots.size > 1 ? "s" : ""}
          </>
        )}
      </Button>
    </form>
  );
}
