import { z } from 'zod';
import { dateObject } from './date';

export const MomentSchema = z.object({
  title: z.string(),
  createdAt: dateObject,
  heroMedia: z
    .object({
      dot: z.string(),
      thumbnail: z.string(),
      fullImage: z.string(),
    })
    .optional(),
  content: z.string(),
  uid: z.string(),
});

export type Moment = z.infer<typeof MomentSchema>;
