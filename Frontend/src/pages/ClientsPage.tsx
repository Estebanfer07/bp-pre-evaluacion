import React from 'react';
import { Button } from '../components';
import './pages.scss';

export const ClientsPage: React.FC = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Clientes</h1>
        <Button variant="primary">Nuevo</Button>
      </div>
      <div className="page__content">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar"
            className="search-input"
          />
        </div>
        <div className="clients-list">
          <p>Lista de clientes aparecerá aquí...</p>
        </div>
      </div>
    </div>
  );
};