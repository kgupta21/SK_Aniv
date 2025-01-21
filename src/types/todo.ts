import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().optional()
});

export type Todo = z.infer<typeof TodoSchema>;

export type TodoFilter = 'all' | 'active' | 'completed';
export type PriorityLevel = 'low' | 'medium' | 'high';