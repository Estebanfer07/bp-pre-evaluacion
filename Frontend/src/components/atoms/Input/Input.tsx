import React from 'react';
import './Input.scss';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  className?: string;
  name?: string;
  id?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  label,
  error,
  className = '',
  name,
  id,
  onChange,
  onBlur,
  onFocus,
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = Boolean(error);
  
  const inputClass = `input ${hasError ? 'input--error' : ''} ${className}`.trim();

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};