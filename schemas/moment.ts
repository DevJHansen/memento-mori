import { z } from 'zod';
import { dateObject } from './date';

export const MomentSchema = z.object({
  title: z.string(),
  body: z.string(),
  createdAt: dateObject,
  heroImage: z.object({
    dotUrl: z.string(),
    thumbnailUrl: z.string(),
    url: z.string(),
    size: z.number().min(0),
  }),
  uid: z.string(),
  week: z.string(),
  userId: z.string(),
});

export const MomentCacheSchema = z.record(
  z.object({
    title: z.string(),
    heroImage: z.string().url(),
    momentId: z.string(),
  })
);

export type Moment = z.infer<typeof MomentSchema>;
export type MomentCache = z.infer<typeof MomentCacheSchema>;
