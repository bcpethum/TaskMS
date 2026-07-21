import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title cannot exceed 255 characters'),

  description: z.string().trim().optional(),

  priority: z.enum(['Low', 'Medium', 'High'], {
    required_error: 'Priority is required',
    invalid_type_error: "Priority must be 'Low', 'Medium', or 'High'",
  }),

  status: z.enum(['Pending', 'In Progress', 'Completed'], {
    required_error: 'Status is required',
    invalid_type_error: "Status must be 'Pending', 'In Progress', or 'Completed'",
  }),

  due_date: z
    .string({ required_error: 'Due date is required' })
    .min(1, 'Due date cannot be empty')
    .refine(
      (date) => {
        const parsed = new Date(date);
        parsed.setHours(0, 0, 0, 0);
        return parsed >= today;
      },
      { message: 'Due date cannot be earlier than today' }
    ),
});

export const updateTaskSchema = createTaskSchema;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
