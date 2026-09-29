import React from 'react';
import { getRiskColor } from '../utils/helpers';

/**
 * RiskBadge - displays Low/Moderate/High with semantic color
 */
export function RiskBadge({ risk, showDot = true }) {
  const colors = getRiskColor(risk);
  return (
    <span
      className={`risk-badge ${showDot ? 'risk-badge--dot' : ''} risk-badge--${risk?.toLowerCase()}`}
      style={{
        background: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {risk || 'Unknown'}
    </span>
  );
}

/**
 * RiskProgressBar - visual progress bar for risk probability
 */
export function RiskProgressBar({ probability, risk, label, showLabel = true }) {
  const pct = Math.round(probability * 100);
  const levelClass = risk?.toLowerCase();
  return (
    <div className="risk-progress">
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-secondary)', fontWeight: 500 }}>
            {label}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: getRiskColor(risk).text }}>
            {pct}%
          </span>
        </div>
      )}
      <div className="risk-progress-bar">
        <div
          className={`risk-progress-fill risk-progress-fill--${levelClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * StatCard - metric card for dashboard KPIs
 */
export function StatCard({ icon, label, value, change, changeType, iconBg, iconColor }) {
  return (
    <div className="stat-card">
      <div
        className="stat-card-icon"
        style={{ background: iconBg || 'var(--clr-primary-50)', color: iconColor || 'var(--clr-primary)' }}
      >
        {icon}
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {change && (
          <div className={`stat-card-change ${changeType || 'positive'}`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * PatientAvatar - initials-based avatar
 */
export function PatientAvatar({ name, size = 'md', style = {} }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  // Consistent color from name
  const colors = [
    ['#1B4F8A', '#DBEAFE'],
    ['#7C3AED', '#F3F0FF'],
    ['#0284C7', '#E0F2FE'],
    ['#EA580C', '#FFF7F0'],
    ['#16A34A', '#F0FDF4'],
    ['#D97706', '#FFFBEB'],
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  const [bg, text] = colors[idx];

  const sizeClass = size === 'sm' ? 'patient-avatar-sm' : size === 'lg' ? 'patient-avatar-lg' : '';

  return (
    <div
      className={`patient-avatar ${sizeClass}`}
      style={{ background: bg, color: text, ...style }}
    >
      {initials}
    </div>
  );
}

/**
 * DiseaseTag - small colored tag for disease labels
 */
export function DiseaseTag({ disease }) {
  const map = {
    diabetes: { label: 'Diabetes', cls: 'disease-tag--diabetes' },
    heartDisease: { label: 'Heart', cls: 'disease-tag--heart' },
    ckd: { label: 'CKD', cls: 'disease-tag--ckd' },
    stroke: { label: 'Stroke', cls: 'disease-tag--stroke' },
  };
  const info = map[disease] || { label: disease, cls: '' };
  return <span className={`disease-tag ${info.cls}`}>{info.label}</span>;
}

/**
 * Card - general card container
 */
export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * CardHeader - card header with title and optional action
 */
export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="card-header">
      <div>
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * EmptyState - empty content placeholder
 */
export function EmptyState({ icon = '📋', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-description">{description}</div>}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  );
}

/**
 * LoadingSpinner
 */
export function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
      {label && <span style={{ color: 'var(--clr-text-muted)', fontSize: 'var(--text-sm)' }}>{label}</span>}
    </div>
  );
}

/**
 * DisclaimerBanner
 */
export function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner">
      <span className="disclaimer-banner-icon">⚠️</span>
      <p className="disclaimer-banner-text">
        <strong>Clinical Decision Support — Important Disclaimer: </strong>
        This system provides risk estimation for clinical decision support only and is{' '}
        <strong>not a substitute for professional medical diagnosis.</strong> All predictions
        should be interpreted by qualified healthcare professionals in conjunction with a complete
        clinical assessment.
      </p>
    </div>
  );
}

/**
 * StatusPill
 */
export function StatusPill({ status }) {
  const cls = status === 'Completed' ? 'status-pill--completed' : 'status-pill--pending';
  return (
    <span className={`status-pill ${cls}`}>
      {status === 'Completed' ? '✓' : '⏳'} {status}
    </span>
  );
}
