import { z } from 'zod';
import { dateObject } from './date';

export const ImageSchema = z.object({
  dotUrl: z.string(),
  thumbnailUrl: z.string(),
  url: z.string(),
  size: z.number().min(0),
});

export type Image = z.infer<typeof ImageSchema>;

export const MementoSchema = z.object({
  title: z.string(),
  body: z.string(),
  createdAt: dateObject,
  updatedAt: dateObject.optional(),
  heroImage: ImageSchema,
  uid: z.string(),
  week: z.string(),
  userId: z.string(),
});

export const MementoCacheSchema = z.record(
  z.object({
    title: z.string(),
    heroImage: z.string().url(),
    mementoId: z.string(),
  })
);

export type Memento = z.infer<typeof MementoSchema>;
export type MementoCache = z.infer<typeof MementoCacheSchema>;
