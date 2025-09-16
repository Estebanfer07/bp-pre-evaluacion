import { z } from "zod";
import { CreatePersonSchema, UpdatePersonSchema, PersonSchema } from "./person";

export const ClientStateSchema = z.enum(["ACTIVE", "INACTIVE"]);
export type ClientState = z.infer<typeof ClientStateSchema>;

export const CreateClientWithPersonSchema = CreatePersonSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters"),
  state: ClientStateSchema,
});

export const UpdateClientWithPersonSchema = UpdatePersonSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not exceed 15 characters")
    .optional(),
  state: ClientStateSchema.optional(),
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
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Please select a gender",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  state: ClientStateSchema.refine(
    (val) => val === "ACTIVE" || val === "INACTIVE",
    { message: "Please select a client state" }
  ),
});

export type ClientForm = z.infer<typeof ClientFormSchema>;
