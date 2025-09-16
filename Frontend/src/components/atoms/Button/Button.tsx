import React from 'react';
import './Button.scss';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled || loading ? 'btn--disabled' : '';
  const loadingClass = loading ? 'btn--loading' : '';
  
  const buttonClass = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${loadingClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="btn__spinner" />}
      <span className={`btn__content ${loading ? 'btn__content--loading' : ''}`}>
        {children}
      </span>
    </button>
  );
};