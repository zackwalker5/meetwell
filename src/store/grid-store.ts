import { create } from "zustand";

interface GridStore {
  selectedSlots: Set<string>;
  isDragging: boolean;
  dragMode: "add" | "remove";
  toggleSlot: (key: string) => void;
  startDrag: (key: string) => void;
  continueDrag: (key: string) => void;
  endDrag: () => void;
  clearSelection: () => void;
  loadFromResponse: (slots: string[]) => void;
}

export const useGridStore = create<GridStore>((set) => ({
  selectedSlots: new Set(),
  isDragging: false,
  dragMode: "add",

  toggleSlot: (key) =>
    set((s) => {
      const next = new Set(s.selectedSlots);
      next.has(key) ? next.delete(key) : next.add(key);
      return { selectedSlots: next };
    }),

  startDrag: (key) =>
    set((s) => {
      const adding = !s.selectedSlots.has(key);
      const next = new Set(s.selectedSlots);
      adding ? next.add(key) : next.delete(key);
      return {
        isDragging: true,
        dragMode: adding ? "add" : "remove",
        selectedSlots: next,
      };
    }),

  continueDrag: (key) =>
    set((s) => {
      if (!s.isDragging) return s;
      const next = new Set(s.selectedSlots);
      s.dragMode === "add" ? next.add(key) : next.delete(key);
      return { selectedSlots: next };
    }),

  endDrag: () => set({ isDragging: false }),

  clearSelection: () => set({ selectedSlots: new Set() }),

  loadFromResponse: (slots) => set({ selectedSlots: new Set(slots) }),
}));
