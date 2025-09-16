import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import './Sidebar.scss';

interface SidebarItem {
  id: string;
  label: string;
  to: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'clients', label: 'Clientes', to: '/clients' },
  { id: 'accounts', label: 'Cuentas', to: '/accounts' },
  { id: 'movements', label: 'Movimientos', to: '/movements' },
  { id: 'reports', label: 'Reportes', to: '/reports' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🏦</span>
          <span className="sidebar__logo-text">BANCO</span>
        </div>
      </div>
      
      <nav className="sidebar__nav">
        <ul className="sidebar__menu">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.to;
            
            return (
              <li key={item.id} className="sidebar__menu-item">
                <Link
                  to={item.to}
                  className={`sidebar__menu-link ${
                    isActive ? 'sidebar__menu-link--active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};