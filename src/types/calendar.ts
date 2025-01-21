import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  start: z.string(), // ISO string
  end: z.string(), // ISO string
  color: z.enum(['blue', 'green', 'red', 'purple', 'yellow']).default('blue'),
  allDay: z.boolean().default(false)
});

export type CalendarEvent = z.infer<typeof EventSchema>;

export type ViewType = 'month' | 'week' | 'day';

export type DateCell = {
  date: Date;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
};