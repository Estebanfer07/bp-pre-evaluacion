import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../atoms/Input/Input";
import { useAccountsWithClients } from "../../../hooks";
import {
  MovementFormSchema,
  MOVEMENT_TYPE_LABELS,
  type MovementForm as MovementFormType,
  MovementTypeOptions,
} from "../../../types/movements";
import "./MovementForm.scss";

export interface MovementFormProps {
  onSubmit: (data: MovementFormType) => void;
  initialData?: Partial<MovementFormType>;
  isLoading?: boolean;
}

export const MovementForm: React.FC<MovementFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { accounts } = useAccountsWithClients();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovementFormType>({
    resolver: zodResolver(MovementFormSchema),
    defaultValues: {
      accountId: initialData?.accountId || "",
      movementType: initialData?.movementType || "DEPOSIT",
      amount: initialData?.amount || 0,
    },
    mode: "onBlur",
  });

  const handleFormSubmit = (data: MovementFormType) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="movement-form"
      role="form"
      noValidate
    >
      <div className="movement-form__section">
        <h3 className="movement-form__section-title">
          Información del Movimiento
        </h3>

        <div className="movement-form__field movement-form__field--full">
          <label className="movement-form__label" htmlFor="accountId">
            Cuenta *
          </label>
          <select
            {...register("accountId")}
            id="accountId"
            className={`movement-form__select ${errors.accountId ? "movement-form__select--error" : ""}`}
            disabled={isLoading}
          >
            <option value="">Seleccione una cuenta</option>
            {accounts?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountNumber} - {account.clientName || "Sin cliente"}{" "}
                - $
                {account.balance.toLocaleString("es-EC", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </option>
            ))}
          </select>
          {errors.accountId && (
            <span className="movement-form__error">
              {errors.accountId.message}
            </span>
          )}
        </div>

        <div className="movement-form__row">
          <div className="movement-form__field">
            <label className="movement-form__label" htmlFor="movementType">
              Tipo de Movimiento *
            </label>
            <select
              {...register("movementType")}
              id="movementType"
              className={`movement-form__select ${errors.movementType ? "movement-form__select--error" : ""}`}
              disabled={isLoading}
            >
              {MovementTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {MOVEMENT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.movementType && (
              <span className="movement-form__error">
                {errors.movementType.message}
              </span>
            )}
          </div>

          <div className="movement-form__field">
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              label="Monto *"
              placeholder="Ingrese el monto"
              error={errors.amount?.message}
              disabled={isLoading}
              step="0.01"
              min="0.01"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
