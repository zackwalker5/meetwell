export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function generateSlots(
  days: string[],
  startTime: number,
  endTime: number,
  slotMinutes: number
): string[] {
  const slots: string[] = [];
  days.forEach((day) => {
    for (let t = startTime; t < endTime; t += slotMinutes) {
      const h = Math.floor(t / 60)
        .toString()
        .padStart(2, "0");
      const m = (t % 60).toString().padStart(2, "0");
      slots.push(`${day}T${h}:${m}`);
    }
  });
  return slots;
}
