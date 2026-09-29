import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Clock, CheckCircle } from 'lucide-react';
import { mockPredictionHistory } from '../data/mockHistory';
import {
  RiskBadge, PatientAvatar, Card, CardHeader,
  StatusPill, EmptyState, LoadingSpinner,
} from '../components/UIComponents';
import { formatDate } from '../utils/helpers';

const RISK_FILTERS = ['All', 'High', 'Moderate', 'Low'];

const HistoryDetailModal = ({ record, onClose }) => {
  if (!record) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 560, width: '100%', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
        className="animate-scale-in"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Assessment Detail</h2>
            <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', fontFamily: 'monospace' }}>{record.id}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', background: 'var(--clr-surface-2)', borderRadius: 10 }}>
          <PatientAvatar name={record.patientName} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{record.patientName}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-text-muted)' }}>{record.patientId} · {formatDate(record.date)} at {record.time}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-text-secondary)' }}>{record.physician}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <RiskBadge risk={record.overallRisk} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Diabetes', key: 'diabetes', icon: '🩸' },
            { label: 'Heart Disease', key: 'heartDisease', icon: '❤️' },
            { label: 'CKD', key: 'ckd', icon: '🫘' },
            { label: 'Stroke', key: 'stroke', icon: '🧠' },
          ].map(({ label, key, icon }) => {
            const result = record.results[key];
            return (
              <div key={key} style={{
                padding: '12px', borderRadius: 10, border: '1px solid var(--clr-border)',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{icon} {label}</span>
                  <RiskBadge risk={result.risk} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: result.risk === 'High' ? 'var(--clr-risk-high)' : result.risk === 'Moderate' ? 'var(--clr-risk-moderate)' : 'var(--clr-risk-low)' }}>
                  {result.riskScore}%
                </div>
              </div>
            );
          })}
        </div>

        {record.notes && (
          <div style={{ padding: '12px 14px', background: '#FFFBEB', borderRadius: 8, border: '1px solid #FDE68A', fontSize: 13, color: '#78350F', lineHeight: 1.6 }}>
            <strong>📋 Clinical Notes:</strong> {record.notes}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Link to={`/patients/${record.patientId}`} className="btn btn-primary" style={{ flex: 1 }}>
            <Eye size={14} /> View Patient Profile
          </Link>
          <Link to="/explainability" className="btn btn-secondary" style={{ flex: 1 }}>
            View XAI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(mockPredictionHistory);
      setFiltered(mockPredictionHistory);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...history];
    const q = search.toLowerCase();
    if (q) {
      result = result.filter(
        (h) =>
          h.patientName.toLowerCase().includes(q) ||
          h.patientId.toLowerCase().includes(q) ||
          h.id.toLowerCase().includes(q)
      );
    }
    if (riskFilter !== 'All') {
      result = result.filter((h) => h.overallRisk === riskFilter);
    }
    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'risk') {
        const order = { High: 0, Moderate: 1, Low: 2 };
        return order[a.overallRisk] - order[b.overallRisk];
      }
      return 0;
    });
    setFiltered(result);
  }, [search, riskFilter, history, sortBy]);

  const counts = {
    total: history.length,
    high: history.filter((h) => h.overallRisk === 'High').length,
    moderate: history.filter((h) => h.overallRisk === 'Moderate').length,
    low: history.filter((h) => h.overallRisk === 'Low').length,
  };

  if (loading) return <LoadingSpinner label="Loading prediction history..." />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Prediction History</h1>
          <p className="page-subtitle">
            {history.length} assessments · Complete record of all risk predictions
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary">
            <Download size={15} /> Export CSV
          </button>
          <Link to="/prediction" className="btn btn-primary">
            New Assessment
          </Link>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-5)' }}>
        {[
          { label: 'Total Assessments', value: counts.total, color: '#2563EB' },
          { label: 'High Risk', value: counts.high, color: '#DC2626' },
          { label: 'Moderate Risk', value: counts.moderate, color: '#D97706' },
          { label: 'Low Risk', value: counts.low, color: '#16A34A' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 'var(--space-4)', borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--clr-text-secondary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: '1 1 240px', minWidth: 200 }}>
            <span className="search-bar-icon"><Search size={16} /></span>
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search by patient name, ID, or assessment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="history-search"
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RISK_FILTERS.map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${riskFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRiskFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <select
            className="form-input form-select"
            style={{ width: 160 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="risk">Highest Risk First</option>
          </select>
        </div>
      </Card>

      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--clr-text-muted)' }}>
        Showing <strong style={{ color: 'var(--clr-text-primary)' }}>{filtered.length}</strong> of {history.length} assessments
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No results found" description="Try adjusting your search or filters." />
      ) : (
        <Card style={{ padding: 0 }}>
          <div className="table-container" style={{ borderRadius: 'var(--radius-xl)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Assessment ID</th>
                  <th>Patient</th>
                  <th>Date & Time</th>
                  <th>Diabetes</th>
                  <th>Heart Disease</th>
                  <th>CKD</th>
                  <th>Stroke</th>
                  <th>Overall Risk</th>
                  <th>Physician</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="clickable" onClick={() => setSelectedRecord(record)}>
                    <td>
                      <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--clr-primary-light)', fontWeight: 600 }}>
                        {record.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PatientAvatar name={record.patientName} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{record.patientName}</div>
                          <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>{record.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--clr-text-secondary)' }}>
                        <Clock size={12} />
                        <div>
                          <div>{formatDate(record.date)}</div>
                          <div style={{ color: 'var(--clr-text-muted)' }}>{record.time}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ textAlign: 'center' }}>
                        <RiskBadge risk={record.results.diabetes.risk} showDot={false} />
                        <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginTop: 2 }}>
                          {record.results.diabetes.riskScore}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ textAlign: 'center' }}>
                        <RiskBadge risk={record.results.heartDisease.risk} showDot={false} />
                        <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginTop: 2 }}>
                          {record.results.heartDisease.riskScore}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ textAlign: 'center' }}>
                        <RiskBadge risk={record.results.ckd.risk} showDot={false} />
                        <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginTop: 2 }}>
                          {record.results.ckd.riskScore}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ textAlign: 'center' }}>
                        <RiskBadge risk={record.results.stroke.risk} showDot={false} />
                        <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginTop: 2 }}>
                          {record.results.stroke.riskScore}%
                        </div>
                      </div>
                    </td>
                    <td><RiskBadge risk={record.overallRisk} /></td>
                    <td style={{ fontSize: 12, color: 'var(--clr-text-secondary)' }}>{record.physician}</td>
                    <td><StatusPill status={record.status} /></td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--clr-primary-light)', fontSize: 12 }}
                        onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <HistoryDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
}
