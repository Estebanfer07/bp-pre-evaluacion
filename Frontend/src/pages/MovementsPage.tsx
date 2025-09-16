import React from 'react';
import './pages.scss';

export const MovementsPage: React.FC = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Movimientos</h1>
      </div>
      <div className="page__content">
        <div className="movements-list">
          <p>Lista de movimientos aparecerá aquí...</p>
        </div>
      </div>
    </div>
  );
};