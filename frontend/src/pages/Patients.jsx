import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, User, Calendar, Phone } from 'lucide-react';
import { mockPatients } from '../data/mockPatients';
import {
  RiskBadge, PatientAvatar, Card, CardHeader,
  EmptyState, LoadingSpinner,
} from '../components/UIComponents';
import { formatDate, debounce } from '../utils/helpers';

const RISK_FILTERS = ['All', 'High Risk', 'Moderate Risk', 'Low Risk'];
const GENDER_FILTERS = ['All', 'Male', 'Female'];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  useEffect(() => {
    const timer = setTimeout(() => {
      setPatients(mockPatients);
      setFiltered(mockPatients);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = patients;
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.conditions.some((c) => c.toLowerCase().includes(q))
      );
    }
    if (riskFilter !== 'All') result = result.filter((p) => p.status === riskFilter);
    if (genderFilter !== 'All') result = result.filter((p) => p.gender === genderFilter);
    setFiltered(result);
  }, [search, riskFilter, genderFilter, patients]);

  const riskCounts = {
    all: patients.length,
    high: patients.filter((p) => p.status === 'High Risk').length,
    moderate: patients.filter((p) => p.status === 'Moderate Risk').length,
    low: patients.filter((p) => p.status === 'Low Risk').length,
  };

  if (loading) return <LoadingSpinner label="Loading patients..." />;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Patient Management</h1>
          <p className="page-subtitle">
            {patients.length} registered patients · {riskCounts.high} high-risk
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/prediction" className="btn btn-primary">
            <Plus size={16} />
            New Assessment
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Total Patients', value: riskCounts.all, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'High Risk', value: riskCounts.high, color: '#DC2626', bg: '#FEF2F2' },
          { label: 'Moderate Risk', value: riskCounts.moderate, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Low Risk', value: riskCounts.low, color: '#16A34A', bg: '#F0FDF4' },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              padding: 'var(--space-4)',
              borderLeft: `3px solid ${s.color}`,
              cursor: 'pointer',
            }}
            onClick={() => setRiskFilter(s.label === 'Total Patients' ? 'All' : s.label)}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: s.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 18,
                color: s.color, flexShrink: 0,
              }}
            >
              {s.value}
            </div>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-secondary)', fontWeight: 500 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <Card style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div className="search-bar" style={{ flex: '1 1 240px', minWidth: 200 }}>
            <span className="search-bar-icon"><Search size={16} /></span>
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              type="text"
              placeholder="Search by name, ID, MRN, or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="patient-search"
            />
          </div>

          {/* Risk Filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {RISK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setRiskFilter(f)}
                className={`btn btn-sm ${riskFilter === f ? 'btn-primary' : 'btn-secondary'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <select
            className="form-input form-select"
            style={{ width: 130 }}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            id="gender-filter"
          >
            {GENDER_FILTERS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--clr-border)', borderRadius: 8, overflow: 'hidden' }}>
            {['table', 'cards'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="btn btn-sm"
                style={{
                  borderRadius: 0,
                  background: viewMode === mode ? 'var(--clr-primary-50)' : 'white',
                  color: viewMode === mode ? 'var(--clr-primary)' : 'var(--clr-text-secondary)',
                  border: 'none',
                  padding: '6px 12px',
                }}
              >
                {mode === 'table' ? '≡ Table' : '⊞ Cards'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)' }}>
        Showing <strong style={{ color: 'var(--clr-text-primary)' }}>{filtered.length}</strong> of {patients.length} patients
        {(search || riskFilter !== 'All' || genderFilter !== 'All') && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 8, fontSize: 12 }}
            onClick={() => { setSearch(''); setRiskFilter('All'); setGenderFilter('All'); }}
          >
            Clear filters ×
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No patients found"
          description="Try adjusting your search or filter criteria."
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <Card style={{ padding: 0 }}>
          <div className="table-container" style={{ borderRadius: 'var(--radius-xl)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>MRN</th>
                  <th>Age / Gender</th>
                  <th>Status</th>
                  <th>Conditions</th>
                  <th>Last Visit</th>
                  <th>Physician</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((patient) => (
                  <tr key={patient.id} className="clickable">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <PatientAvatar name={patient.name} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{patient.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--clr-text-muted)' }}>{patient.mrn}</td>
                    <td style={{ fontSize: 13 }}>
                      {patient.age}y · {patient.gender}
                    </td>
                    <td><RiskBadge risk={patient.status.replace(' Risk', '')} /></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                        {patient.conditions.length === 0 ? (
                          <span style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>None recorded</span>
                        ) : (
                          patient.conditions.slice(0, 2).map((c) => (
                            <span key={c} style={{
                              fontSize: 11, padding: '2px 6px',
                              background: 'var(--clr-surface-2)', borderRadius: 4,
                              color: 'var(--clr-text-secondary)',
                            }}>
                              {c}
                            </span>
                          ))
                        )}
                        {patient.conditions.length > 2 && (
                          <span style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>+{patient.conditions.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--clr-text-secondary)' }}>
                      {formatDate(patient.lastVisit)}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--clr-text-secondary)' }}>
                      {patient.primaryPhysician}
                    </td>
                    <td>
                      <Link
                        to={`/patients/${patient.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--clr-primary-light)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid-3 stagger-children">
          {filtered.map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <PatientAvatar name={patient.name} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--clr-text-primary)' }}>{patient.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>{patient.id} · {patient.mrn}</div>
                    </div>
                  </div>
                  <RiskBadge risk={patient.status.replace(' Risk', '')} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {[
                    { icon: <User size={12} />, label: `${patient.age}y · ${patient.gender}` },
                    { icon: <Phone size={12} />, label: patient.bloodGroup },
                    { icon: <Calendar size={12} />, label: formatDate(patient.lastVisit) },
                    { icon: <User size={12} />, label: patient.primaryPhysician.replace('Dr. ', '') },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--clr-text-secondary)' }}>
                      <span style={{ color: 'var(--clr-text-muted)' }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>

                {patient.conditions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {patient.conditions.map((c) => (
                      <span key={c} style={{
                        fontSize: 10, padding: '2px 7px',
                        background: 'var(--clr-surface-2)', borderRadius: 4,
                        color: 'var(--clr-text-secondary)', border: '1px solid var(--clr-border)',
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <hr className="section-divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Object.entries(patient.lastPrediction || {}).filter(([k]) => k !== 'date').slice(0, 3).map(([disease, val]) => (
                      <div key={disease} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginBottom: 2 }}>
                          {disease === 'heartDisease' ? '❤️' : disease === 'diabetes' ? '🩸' : disease === 'ckd' ? '🫘' : '🧠'}
                        </div>
                        <RiskBadge risk={val.risk} showDot={false} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--clr-primary-light)', fontWeight: 500 }}>
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
