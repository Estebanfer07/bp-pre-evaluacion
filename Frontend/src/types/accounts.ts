import { z } from "zod";

export const AccountTypeSchema = z.enum(["AHO", "CTE"]);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const AccountStateSchema = z.enum(["ACTIVE", "INACTIVE"]);
export type AccountState = z.infer<typeof AccountStateSchema>;

export const CreateAccountSchema = z.object({
  type: AccountTypeSchema,
  balance: z.number().min(0, "Balance must be zero or positive"),
  clientId: z.uuid("Invalid client ID format"),
});

export const UpdateAccountSchema = z.object({
  type: AccountTypeSchema.optional(),
  balance: z.number().min(0, "Balance must be zero or positive").optional(),
  state: AccountStateSchema.optional(),
});

export type CreateAccount = z.infer<typeof CreateAccountSchema>;
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>;

export const AccountSchema = z.object({
  id: z.uuid(),
  clientId: z.uuid(),
  accountNumber: z.string(),
  type: AccountTypeSchema,
  balance: z.number(),
  state: AccountStateSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountWithClientSchema = AccountSchema.extend({
  client: z
    .object({
      id: z.uuid(),
      person: z.object({
        name: z.string(),
        identification: z.string(),
      }),
      state: AccountStateSchema,
    })
    .optional(),
});

export type AccountWithClient = z.infer<typeof AccountWithClientSchema>;

export const AccountListItemSchema = z.object({
  id: z.uuid(),
  accountNumber: z.string(),
  type: AccountTypeSchema,
  balance: z.number(),
  state: AccountStateSchema,
  clientName: z.string().optional(),
  createdAt: z.iso.datetime(),
  clientId: z.uuid().optional(),
});

export type AccountListItem = z.infer<typeof AccountListItemSchema>;

export const AccountsListResponseSchema = z.array(AccountSchema);
export type AccountsListResponse = z.infer<typeof AccountsListResponseSchema>;

export const AccountFormSchema = z.object({
  type: AccountTypeSchema.refine((val) => val === "AHO" || val === "CTE", {
    message: "Please select an account type",
  }),
  balance: z.number().min(0, "Initial balance must be zero or positive"),
  clientId: z.uuid("Invalid client ID format"),
});

export const AccountUpdateFormSchema = z.object({
  type: AccountTypeSchema.refine((val) => val === "AHO" || val === "CTE", {
    message: "Please select an account type",
  }).optional(),
  balance: z.number().min(0, "Balance must be zero or positive").optional(),
});

export type AccountForm = z.infer<typeof AccountFormSchema>;
export type AccountUpdateForm = z.infer<typeof AccountUpdateFormSchema>;

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  AHO: "Ahorros",
  CTE: "Corriente",
};

export const ACCOUNT_STATE_LABELS: Record<AccountState, string> = {
  ACTIVE: "Activa",
  INACTIVE: "Inactiva",
};
