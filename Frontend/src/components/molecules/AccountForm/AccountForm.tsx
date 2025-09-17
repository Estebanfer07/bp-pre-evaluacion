import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../atoms/Input/Input";
import { useClientsQueries } from "../../../hooks/services/useClientsQueries";
import {
  AccountFormSchema,
  ACCOUNT_TYPE_LABELS,
  type AccountForm as AccountFormType,
  type AccountType,
} from "../../../types/accounts";
import "./AccountForm.scss";

export interface AccountFormProps {
  onSubmit: (data: AccountFormType) => void;
  initialData?: Partial<AccountFormType>;
  isLoading?: boolean;
}

export const AccountForm: React.FC<AccountFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { useGetClients } = useClientsQueries();
  const { data: clients } = useGetClients();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormType>({
    resolver: zodResolver(AccountFormSchema),
    defaultValues: {
      type: initialData?.type || "AHO",
      balance: initialData?.balance || 0,
      clientId: initialData?.clientId || "",
    },
    mode: "onChange",
  });

  const handleFormSubmit = (data: AccountFormType) => {
    onSubmit(data);
  };

  const accountTypes: AccountType[] = ["AHO", "CTE"];

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="account-form"
      role="form"
      noValidate
    >
      <div className="account-form__section">
        <h3 className="account-form__section-title">
          Información de la Cuenta
        </h3>

        <div className="account-form__row">
          <div className="account-form__field">
            <label className="account-form__label" htmlFor="type">
              Tipo de Cuenta *
            </label>
            <select
              {...register("type")}
              id="type"
              className={`account-form__select ${errors.type ? "account-form__select--error" : ""}`}
              disabled={isLoading}
            >
              {accountTypes.map((type) => (
                <option key={type} value={type}>
                  {ACCOUNT_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors.type && (
              <span className="account-form__error">{errors.type.message}</span>
            )}
          </div>

          <div className="account-form__field">
            <Input
              {...register("balance", { valueAsNumber: true })}
              type="number"
              label="Saldo Inicial *"
              placeholder="Ingrese el saldo inicial"
              error={errors.balance?.message}
              disabled={isLoading}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="account-form__field account-form__field--full">
          <label className="account-form__label" htmlFor="clientId">
            Cliente *
          </label>
          <select
            {...register("clientId")}
            id="clientId"
            className={`account-form__select ${errors.clientId ? "account-form__select--error" : ""}`}
            disabled={isLoading}
          >
            <option value="">Seleccione un cliente</option>
            {clients?.map((client) => (
              <option key={client.id} value={client.id}>
                {client.person.name} - {client.person.identification}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <span className="account-form__error">
              {errors.clientId.message}
            </span>
          )}
        </div>
      </div>
    </form>
  );
};
