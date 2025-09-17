import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../atoms/Input/Input";
import {
  clientGenderLabels,
  clientGenderValues,
  ClientFormSchema,
  type ClientForm as ClientFormType,
} from "../../../types/clients";
import "./ClientForm.scss";

export interface ClientFormProps {
  onSubmit: (data: ClientFormType) => void;
  initialData?: Partial<ClientFormType>;
  isLoading?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormType>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      identification: initialData?.identification || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      age: initialData?.age || undefined,
      gender: initialData?.gender || "MALE",
      password: initialData?.password || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: ClientFormType) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="client-form"
      role="form"
      noValidate
    >
      <div className="client-form__section">
        <h3 className="client-form__section-title">Información Personal</h3>

        <div className="client-form__row">
          <div className="client-form__field">
            <Input
              {...register("name")}
              label="Nombre completo *"
              placeholder="Ingrese el nombre completo"
              error={errors.name?.message}
              disabled={isLoading}
            />
          </div>

          <div className="client-form__field">
            <Input
              {...register("identification")}
              label="Identificación *"
              placeholder="Ingrese la identificación"
              error={errors.identification?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="client-form__row">
          <div className="client-form__field">
            <Input
              {...register("phone")}
              label="Teléfono *"
              placeholder="Ingrese el teléfono"
              error={errors.phone?.message}
              disabled={isLoading}
            />
          </div>

          <div className="client-form__field">
            <Input
              {...register("age", { valueAsNumber: true })}
              type="number"
              label="Edad *"
              placeholder="Ingrese la edad"
              error={errors.age?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="client-form__field client-form__field--full">
          <Input
            {...register("address")}
            label="Dirección *"
            placeholder="Ingrese la dirección completa"
            error={errors.address?.message}
            disabled={isLoading}
          />
        </div>

        <div className="client-form__field">
          <label className="client-form__label" htmlFor="gender">
            Género *
          </label>
          <select
            {...register("gender")}
            id="gender"
            className={`client-form__select ${errors.gender ? "client-form__select--error" : ""}`}
            disabled={isLoading}
          >
            {clientGenderValues.map((gender) => (
              <option key={gender} value={gender}>
                {clientGenderLabels[gender]}
              </option>
            ))}
          </select>
          {errors.gender && (
            <span className="client-form__error">{errors.gender.message}</span>
          )}
        </div>
      </div>

      <div className="client-form__section">
        <h3 className="client-form__section-title">Información de Cuenta</h3>

        <div className="client-form__field">
          <Input
            {...register("password")}
            type="password"
            label="Contraseña *"
            placeholder="Ingrese la contraseña"
            error={errors.password?.message}
            disabled={isLoading}
          />
        </div>
      </div>
    </form>
  );
};
