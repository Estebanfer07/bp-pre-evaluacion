import { z } from "zod";

export const GenderSchema = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof GenderSchema>;

export const CreatePersonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: GenderSchema,
  age: z.number().int().min(0, "Age must be a positive number"),
  identification: z.string().min(1, "Identification is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
});

export const UpdatePersonSchema = CreatePersonSchema.partial();

export type CreatePerson = z.infer<typeof CreatePersonSchema>;
export type UpdatePerson = z.infer<typeof UpdatePersonSchema>;

export const PersonSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  gender: GenderSchema,
  age: z.number().int(),
  identification: z.string(),
  address: z.string(),
  phone: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Person = z.infer<typeof PersonSchema>;
