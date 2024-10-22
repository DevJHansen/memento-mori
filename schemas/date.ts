import { z } from 'zod';

export const dateObject = z.object({
  unix: z.number(),
  timestamp: z.string().max(100, ''),
  day: z.number(),
  month: z.number(),
  year: z.number(),
});
