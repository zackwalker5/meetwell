export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  owner_id: string | null;
  days: string[];
  start_time: number;
  end_time: number;
  slot_minutes: number;
  created_at: string;
  expires_at: string | null;
}

export interface Response {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  slots: string[];
  created_at: string;
}
