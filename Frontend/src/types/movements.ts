import { z } from "zod";
import { AccountTypeSchema } from "./accounts";

export const ReportFormatOptions = ["PDF", "JSON"] as const;
export const ReportFormatSchema = z.enum(ReportFormatOptions);
export type ReportFormat = z.infer<typeof ReportFormatSchema>;

export const MovementTypeOptions = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
] as const;
export const MovementTypeSchema = z.enum(MovementTypeOptions);
export type MovementType = z.infer<typeof MovementTypeSchema>;

export const CreateMovementSchema = z.object({
  accountId: z.uuid("Account ID is required"),
  movementType: MovementTypeSchema,
  amount: z.number().positive("Amount must be positive"),
});

export const UpdateMovementSchema = z.object({
  movementType: MovementTypeSchema.optional(),
  amount: z.number().positive("Amount must be positive").optional(),
});

export type CreateMovement = z.infer<typeof CreateMovementSchema>;
export type UpdateMovement = z.infer<typeof UpdateMovementSchema>;

export const MovementSchema = z.object({
  id: z.uuid(),
  accountId: z.uuid(),
  date: z.iso.datetime(),
  movementType: MovementTypeSchema,
  amount: z.number(),
  balance: z.number(),
  isReversed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Movement = z.infer<typeof MovementSchema>;

export const MovementWithAccountSchema = MovementSchema.extend({
  account: z
    .object({
      id: z.uuid(),
      accountNumber: z.string(),
      type: AccountTypeSchema,
      client: z
        .object({
          id: z.uuid(),
          person: z.object({
            name: z.string(),
            identification: z.string(),
          }),
        })
        .optional(),
    })
    .optional(),
});

export type MovementWithAccount = z.infer<typeof MovementWithAccountSchema>;

export const MovementListItemSchema = z.object({
  id: z.uuid(),
  accountId: z.uuid(),
  accountNumber: z.string().optional(),
  clientName: z.string().optional(),
  date: z.iso.datetime(),
  movementType: MovementTypeSchema,
  amount: z.number(),
  balance: z.number(),
  isReversed: z.boolean(),
  createdAt: z.iso.datetime(),
});

export type MovementListItem = z.infer<typeof MovementListItemSchema>;

export const MovementsListResponseSchema = z.array(MovementSchema);
export type MovementsListResponse = z.infer<typeof MovementsListResponseSchema>;

export const GenerateReportSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  format: ReportFormatSchema,
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});

export type GenerateReport = z.infer<typeof GenerateReportSchema>;

export const MovementFormSchema = z.object({
  accountId: z.string().min(1, "Please select an account"),
  movementType: MovementTypeSchema.refine((val) => !!val, {
    message: "Please select a movement type",
  }),
  amount: z.number().positive("Amount must be greater than 0"),
});

export const ReportFormSchema = z.object({
  accountId: z.string().min(1, "Please select an account"),
  format: z.enum(ReportFormatOptions, {
    message: "Please select a report format",
  }),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type MovementForm = z.infer<typeof MovementFormSchema>;
export type ReportForm = z.infer<typeof ReportFormSchema>;

// Report response types
export const MovementReportItemSchema = z.object({
  date: z.string(),
  amount: z.number(),
  clientId: z.string(),
  balance: z.number(),
  clientName: z.string(),
  id: z.string(),
  type: MovementTypeSchema,
  accountNumber: z.string(),
});

export type MovementReportItem = z.infer<typeof MovementReportItemSchema>;

export const JsonReportResponseSchema = z.object({
  jsonReport: z.array(MovementReportItemSchema),
});

export type JsonReportResponse = z.infer<typeof JsonReportResponseSchema>;

export const PdfReportResponseSchema = z.object({
  pdfReport: z.string(), // Base64 encoded PDF
});

export type PdfReportResponse = z.infer<typeof PdfReportResponseSchema>;

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  DEPOSIT: "Depósito",
  WITHDRAWAL: "Retiro",
  TRANSFER: "Transferencia",
};
