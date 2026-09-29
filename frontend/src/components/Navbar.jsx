import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, ChevronRight, Settings } from 'lucide-react';

const breadcrumbMap = {
  '/': ['Dashboard'],
  '/patients': ['Patients'],
  '/prediction': ['Risk Prediction'],
  '/explainability': ['Explainability (XAI)'],
  '/history': ['Prediction History'],
  '/reports': ['Reports'],
};

const pageTitleMap = {
  '/': 'Dashboard Overview',
  '/patients': 'Patient Management',
  '/prediction': 'Risk Prediction',
  '/explainability': 'XAI — Explainability',
  '/history': 'Prediction History',
  '/reports': 'Clinical Reports',
};

export default function Navbar() {
  const location = useLocation();

  const getBasePath = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}` : '/';
  };

  const basePath = getBasePath();
  const crumbs = breadcrumbMap[basePath] || ['Unknown'];
  const isPatientDetail = location.pathname.startsWith('/patients/');

  return (
    <header className="navbar">
      {/* Breadcrumb / Title */}
      <div className="navbar-breadcrumb">
        <span className="navbar-breadcrumb-text">MedCDSS</span>
        <ChevronRight size={14} color="var(--clr-text-muted)" />
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb}>
            <span
              className="navbar-breadcrumb-text"
              style={i === crumbs.length - 1 ? { fontWeight: 600, color: 'var(--clr-text-primary)' } : {}}
            >
              {crumb}
            </span>
            {i < crumbs.length - 1 && <ChevronRight size={14} color="var(--clr-text-muted)" />}
          </React.Fragment>
        ))}
        {isPatientDetail && (
          <>
            <ChevronRight size={14} color="var(--clr-text-muted)" />
            <span className="navbar-breadcrumb-text" style={{ fontWeight: 600, color: 'var(--clr-text-primary)' }}>
              Patient Profile
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        {/* Notifications */}
        <button className="navbar-icon-btn" title="Notifications" aria-label="Notifications">
          <Bell size={16} />
          <span className="notification-dot" />
        </button>

        {/* Settings */}
        <button className="navbar-icon-btn" title="Settings" aria-label="Settings">
          <Settings size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--clr-border)' }} />

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="navbar-avatar" title="Dr. Priya Mehta">PM</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">Dr. Priya Mehta</span>
            <span className="navbar-user-role">Senior Consultant</span>
          </div>
        </div>
      </div>
    </header>
  );
}
