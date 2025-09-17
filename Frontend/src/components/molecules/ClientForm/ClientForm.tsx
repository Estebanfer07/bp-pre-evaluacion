import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../atoms/Input/Input";
import {
  clientGenderLabels,
  clientGenderValues,
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
              {...register("name", {
                required: "Name is required",
                minLength: { value: 1, message: "Name is required" },
              })}
              label="Nombre completo *"
              placeholder="Ingrese el nombre completo"
              error={errors.name?.message}
              disabled={isLoading}
            />
          </div>

          <div className="client-form__field">
            <Input
              {...register("identification", {
                required: "Identification is required",
                minLength: { value: 1, message: "Identification is required" },
              })}
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
              {...register("phone", {
                required: "Phone is required",
                minLength: { value: 1, message: "Phone is required" },
              })}
              label="Teléfono *"
              placeholder="Ingrese el teléfono"
              error={errors.phone?.message}
              disabled={isLoading}
            />
          </div>

          <div className="client-form__field">
            <Input
              {...register("age", {
                required: "Age is required",
                valueAsNumber: true,
                min: { value: 1, message: "Age must be greater than 0" },
                max: { value: 120, message: "Age must be less than 120" },
              })}
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
            {...register("address", {
              required: "Address is required",
              minLength: { value: 1, message: "Address is required" },
            })}
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
            {...register("gender", { required: "Please select a gender" })}
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
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 15,
                message: "Password must not exceed 15 characters",
              },
            })}
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
