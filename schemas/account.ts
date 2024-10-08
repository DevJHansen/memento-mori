import { z } from 'zod';
import { dateObject } from './date';

const planEnums = z.enum(['free', 'pro']);

export const AccountSchema = z.object({
  firstName: z.string(),
  surname: z.string(),
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
  firstName: z.string(),
  surname: z.string(),
  dob: dateObject,
  plan: planEnums,
});

export type Account = z.infer<typeof AccountSchema>;
export type NewAccount = z.infer<typeof NewAccountSchema>;
