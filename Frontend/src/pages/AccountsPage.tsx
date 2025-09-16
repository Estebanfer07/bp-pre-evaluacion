import React from 'react';
import { Button } from '../components';
import './pages.scss';

export const AccountsPage: React.FC = () => {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Cuentas</h1>
        <Button variant="primary">Nueva</Button>
      </div>
      <div className="page__content">
        <div className="accounts-list">
          <p>Lista de cuentas aparecerá aquí...</p>
        </div>
      </div>
    </div>
  );
};