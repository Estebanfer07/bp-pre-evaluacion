import { z } from "zod";
import { CreatePersonSchema, UpdatePersonSchema, PersonSchema } from "./person";

export const clientStateValues = ["ACTIVE", "INACTIVE"] as const;
export const ClientStateSchema = z.enum(clientStateValues);
export type ClientState = z.infer<typeof ClientStateSchema>;

export const clientGenderValues = ["MALE", "FEMALE", "OTHER"] as const;
export const clientGenderLabels = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};
export const ClientGenderSchema = z.enum(clientGenderValues);
export type ClientGender = z.infer<typeof ClientGenderSchema>;

export const CreateClientWithPersonSchema = CreatePersonSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters"),
});

export const UpdateClientWithPersonSchema = UpdatePersonSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .optional(),
});

export type CreateClientWithPerson = z.infer<
  typeof CreateClientWithPersonSchema
>;
export type UpdateClientWithPerson = z.infer<
  typeof UpdateClientWithPersonSchema
>;

export const ClientSchema = z.object({
  id: z.uuid(),
  person: PersonSchema,
  password: z.string(),
  state: ClientStateSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Client = z.infer<typeof ClientSchema>;

export const ClientResponseSchema = ClientSchema.omit({ password: true });
export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientListItemSchema = z.object({
  id: z.uuid(),
  person: z.object({
    name: z.string(),
    identification: z.string(),
    phone: z.string(),
  }),
  state: ClientStateSchema,
  createdAt: z.iso.datetime(),
});

export type ClientListItem = z.infer<typeof ClientListItemSchema>;

export const ClientsListResponseSchema = z.array(ClientResponseSchema);
export type ClientsListResponse = z.infer<typeof ClientsListResponseSchema>;

export const ClientFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  identification: z.string().min(1, "Identification is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  gender: ClientGenderSchema.refine((val) => !!val, {
    message: "Please select a gender",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ClientForm = z.infer<typeof ClientFormSchema>;
