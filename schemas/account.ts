import { z } from 'zod';
import { dateObject } from './date';

const planEnums = z.enum(['free', 'pro']);

export const AccountSchema = z.object({
  firstName: z.string().max(50, 'Text is too long'),
  surname: z.string().max(50, 'Text is too long'),
  weeklyReminders: z.boolean(),
  createdAt: dateObject,
  dob: dateObject,
  uid: z.string(),
  plan: planEnums,
  storageUsage: z.object({
    bytesUsed: z.number(),
    maxUsage: z.number(),
  }),
});

export const NewAccountSchema = z.object({
  firstName: z.string().max(50, 'Text is too long'),
  surname: z.string().max(50, 'Text is too long'),
  dob: dateObject,
  weeklyReminders: z.boolean(),
});

export type Account = z.infer<typeof AccountSchema>;
export type NewAccount = z.infer<typeof NewAccountSchema>;
