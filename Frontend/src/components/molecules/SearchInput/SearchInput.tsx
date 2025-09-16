import React, { useState, useEffect } from 'react';
import { Input } from '../../atoms';
import { useDebounce } from '../../../hooks/useDebounce';
import './SearchInput.scss';

export interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceDelay?: number;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Buscar...',
  onSearch,
  debounceDelay = 300,
  defaultValue = '',
  disabled = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className={`search-input ${className}`.trim()}>
      <div className="search-input__container">
        <div className="search-input__icon">
          🔍
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          disabled={disabled}
          className="search-input__field"
        />
        {searchTerm && !disabled && (
          <button
            type="button"
            className="search-input__clear"
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};