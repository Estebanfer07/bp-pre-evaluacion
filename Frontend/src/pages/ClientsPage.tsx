import React, { useCallback } from 'react';
import { Button, SearchInput } from '../components';
import './pages.scss';

export const ClientsPage: React.FC = () => {
  const handleSearch = useCallback((query: string) => {
    console.log('Searching for:', query);
  }, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1>Clientes</h1>
        <Button variant="primary">Nuevo</Button>
      </div>
      <div className="page__content">
        <div className="search-section">
          <SearchInput
            placeholder="Buscar clientes..."
            onSearch={handleSearch}
            debounceDelay={300}
          />
        </div>
        <div className="clients-list">
          <p>Lista de clientes aparecerá aquí...</p>
        </div>
      </div>
    </div>
  );
};