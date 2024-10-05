import { z } from 'zod';

export const AccountSchema = z.object({
  firstName: z.string(),
  surname: z.string(),
  createdAt: z.number(),
  dob: z.number(),
  uid: z.string(),
});

export const NewAccountSchema = z.object({
  firstName: z.string(),
  surname: z.string(),
  dob: z.number(),
});

export type Account = z.infer<typeof AccountSchema>;
export type NewAccount = z.infer<typeof NewAccountSchema>;
