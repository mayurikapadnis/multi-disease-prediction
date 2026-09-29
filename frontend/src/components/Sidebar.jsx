import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Activity, Brain, History,
  FileText, Heart, AlertTriangle
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Patients', path: '/patients', icon: Users },
  { label: 'Risk Prediction', path: '/prediction', icon: Activity },
  { label: 'Explainability', path: '/explainability', icon: Brain },
  { label: 'Prediction History', path: '/history', icon: History },
  { label: 'Reports', path: '/reports', icon: FileText },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Heart size={18} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">MedCDSS</span>
          <span className="sidebar-brand-subtitle">Clinical Decision Support</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main Navigation</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">
                <Icon size={18} />
              </span>
              {item.label}
            </NavLink>
          );
        })}

        <span className="sidebar-section-label" style={{ marginTop: '8px' }}>Diseases Monitored</span>
        <div style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { label: 'Diabetes', color: '#7C3AED', bg: '#F3F0FF' },
            { label: 'Heart Disease', color: '#DC2626', bg: '#FFF0F0' },
            { label: 'Kidney Disease (CKD)', color: '#0284C7', bg: '#F0F9FF' },
            { label: 'Stroke', color: '#EA580C', bg: '#FFF7F0' },
          ].map((d) => (
            <div
              key={d.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: d.color,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: d.color,
                  flexShrink: 0,
                }}
              />
              {d.label}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Disclaimer */}
      <div className="sidebar-footer">
        <div className="sidebar-disclaimer">
          <strong>⚕️ Clinical Disclaimer</strong>
          This system provides risk estimation for decision support and is not a substitute for professional medical diagnosis.
        </div>
      </div>
    </aside>
  );
}
