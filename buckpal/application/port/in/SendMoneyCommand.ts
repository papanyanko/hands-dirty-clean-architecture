import { z } from 'zod';

export const SendMoneyCommandSchema = z.object({
  sourceAccountId: z.string().nonempty('Source account is required'),
  targetAccountId: z.string().nonempty('Target account is required'),
  money: z.instanceof(Money).refine((money) => !money.isNegative(), {
    message: 'The amount of money must be positive',
  }),
});

export type SendMoneyCommandType = z.infer<typeof SendMoneyCommandSchema>;
