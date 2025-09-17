import React from "react";
import "./Input.scss";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  error,
  className,
  id,
  name,
  required,
  ...rest
}) => {
  const inputId =
    id || name || `input-${Math.random().toString(36).slice(2, 9)}`;
  const hasError = Boolean(error);

  const inputClass = ["input", hasError && "input--error", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        className={inputClass}
        {...rest} // everything else (onChange, placeholder, disabled, etc.)
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
