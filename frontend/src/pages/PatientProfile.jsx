import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, Phone, MapPin, User, Droplets, Pill, AlertCircle } from 'lucide-react';
import { getPatientById } from '../data/mockPatients';
import { getHistoryByPatient } from '../data/mockHistory';
import {
  RiskBadge, RiskProgressBar, PatientAvatar, Card, CardHeader,
  StatusPill, DisclaimerBanner, LoadingSpinner,
} from '../components/UIComponents';
import { formatDate, getDiseaseInfo } from '../utils/helpers';

const EHRMetric = ({ label, value, unit = '', normal = '', highlight = false }) => (
  <div style={{
    padding: '12px 14px',
    background: highlight ? 'var(--clr-risk-high-bg)' : 'var(--clr-surface-2)',
    borderRadius: 10,
    border: `1px solid ${highlight ? 'var(--clr-risk-high-border)' : 'var(--clr-border-light)'}`,
  }}>
    <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginBottom: 2, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? 'var(--clr-risk-high)' : 'var(--clr-text-primary)', lineHeight: 1 }}>
      {value}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2, color: 'var(--clr-text-muted)' }}>{unit}</span>
    </div>
    {normal && (
      <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', marginTop: 2 }}>Normal: {normal}</div>
    )}
  </div>
);

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const p = getPatientById(id);
      if (p) {
        setPatient(p);
        setHistory(getHistoryByPatient(id));
      }
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading patient profile..." />;
  if (!patient) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h2>Patient Not Found</h2>
      <p style={{ color: 'var(--clr-text-muted)', marginBottom: 16 }}>No patient with ID: {id}</p>
      <Link to="/patients" className="btn btn-primary">Back to Patients</Link>
    </div>
  );

  const { ehr, lastPrediction } = patient;
  const diseases = [
    { key: 'diabetes', ...getDiseaseInfo('diabetes') },
    { key: 'heartDisease', ...getDiseaseInfo('heartDisease') },
    { key: 'ckd', ...getDiseaseInfo('ckd') },
    { key: 'stroke', ...getDiseaseInfo('stroke') },
  ];

  return (
    <div className="animate-fade-in">
      {/* Back Nav */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate('/patients')}>
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <DisclaimerBanner />

      {/* Patient Header Card */}
      <Card style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <PatientAvatar name={patient.name} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{patient.name}</h2>
              <RiskBadge risk={patient.status.replace(' Risk', '')} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 13, color: 'var(--clr-text-secondary)' }}>
              <span><User size={13} style={{ display: 'inline', marginRight: 4 }} />{patient.age} years · {patient.gender}</span>
              <span><Droplets size={13} style={{ display: 'inline', marginRight: 4 }} />Blood Group: {patient.bloodGroup}</span>
              <span><Phone size={13} style={{ display: 'inline', marginRight: 4 }} />{patient.contact}</span>
              <span><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />{patient.address}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 6 }}>
              <span>MRN: <strong style={{ color: 'var(--clr-text-primary)' }}>{patient.mrn}</strong></span>
              <span>DOB: <strong style={{ color: 'var(--clr-text-primary)' }}>{formatDate(patient.dob)}</strong></span>
              <span>Registered: <strong style={{ color: 'var(--clr-text-primary)' }}>{formatDate(patient.registeredDate)}</strong></span>
              <span>Last Visit: <strong style={{ color: 'var(--clr-text-primary)' }}>{formatDate(patient.lastVisit)}</strong></span>
              <span>Physician: <strong style={{ color: 'var(--clr-text-primary)' }}>{patient.primaryPhysician}</strong></span>
            </div>
            {patient.conditions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {patient.conditions.map((c) => (
                  <span key={c} style={{
                    fontSize: 11, padding: '3px 9px',
                    background: 'var(--clr-primary-50)', color: 'var(--clr-primary)',
                    borderRadius: 20, border: '1px solid var(--clr-primary-100)', fontWeight: 500,
                  }}>{c}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <Link to={`/prediction?patient=${patient.id}`} className="btn btn-primary">
              <Activity size={15} /> New Risk Assessment
            </Link>
            <Link to="/explainability" className="btn btn-secondary btn-sm">
              View XAI Explanation
            </Link>
          </div>
        </div>
      </Card>

      {/* Last Prediction Summary */}
      {lastPrediction && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-text-secondary)', marginBottom: 10 }}>
            <Clock size={13} style={{ display: 'inline', marginRight: 4 }} />
            Last Assessment: {formatDate(lastPrediction.date)}
          </div>
          <div className="grid-4 stagger-children">
            {diseases.map(({ key, label, icon, color, colorLight }) => {
              const pred = lastPrediction[key];
              return (
                <div key={key} className="risk-result-card" style={{ borderLeftColor: pred.risk === 'High' ? 'var(--clr-risk-high)' : pred.risk === 'Moderate' ? 'var(--clr-risk-moderate)' : 'var(--clr-risk-low)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: colorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                        {icon}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--clr-text-primary)' }}>{label}</span>
                    </div>
                    <RiskBadge risk={pred.risk} />
                  </div>
                  <RiskProgressBar probability={pred.probability} risk={pred.risk} label="Probability" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {[
          { key: 'overview', label: 'Clinical Overview' },
          { key: 'ehr', label: 'EHR / Lab Values' },
          { key: 'medications', label: 'Medications & Allergies' },
          { key: 'history', label: `Assessment History (${history.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid-2 animate-fade-in">
          <Card>
            <CardHeader title="Lifestyle Factors" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Smoking Status', value: ehr.smoking },
                { label: 'Alcohol Consumption', value: ehr.alcohol },
                { label: 'Physical Activity Level', value: ehr.physicalActivity },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--clr-border-light)' }}>
                  <span style={{ fontSize: 13, color: 'var(--clr-text-secondary)' }}>{item.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: item.value === 'High' || item.value === 'Never' || item.value === 'None' ? 'var(--clr-risk-low-bg)' : item.value === 'Low' || item.value === 'Current' || item.value === 'Heavy' ? 'var(--clr-risk-high-bg)' : 'var(--clr-risk-moderate-bg)',
                    color: item.value === 'High' || item.value === 'Never' || item.value === 'None' ? 'var(--clr-risk-low)' : item.value === 'Low' || item.value === 'Current' || item.value === 'Heavy' ? 'var(--clr-risk-high)' : 'var(--clr-risk-moderate)',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Family History" />
            {ehr.familyHistory.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>No known family history of chronic conditions.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ehr.familyHistory.map((fh) => (
                  <span key={fh} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 20,
                    background: 'var(--clr-risk-moderate-bg)', color: 'var(--clr-risk-moderate)',
                    border: '1px solid var(--clr-risk-moderate-border)', fontWeight: 500,
                  }}>
                    ⚠️ {fh}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'ehr' && (
        <Card className="animate-fade-in">
          <CardHeader title="EHR — Laboratory & Vital Values" subtitle="Most recent recorded measurements" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            <EHRMetric label="Fasting Glucose" value={ehr.glucose} unit="mg/dL" normal="70–100" highlight={ehr.glucose > 125} />
            <EHRMetric label="HbA1c" value={ehr.hba1c} unit="%" normal="< 5.7%" highlight={ehr.hba1c > 6.5} />
            <EHRMetric label="Blood Pressure" value={ehr.bloodPressure} unit="mmHg" normal="< 120/80" highlight={parseInt(ehr.bloodPressure) > 130} />
            <EHRMetric label="BMI" value={ehr.bmi} unit="kg/m²" normal="18.5–24.9" highlight={ehr.bmi > 30} />
            <EHRMetric label="Total Cholesterol" value={ehr.cholesterol} unit="mg/dL" normal="< 200" highlight={ehr.cholesterol > 240} />
            <EHRMetric label="Triglycerides" value={ehr.triglycerides} unit="mg/dL" normal="< 150" highlight={ehr.triglycerides > 200} />
            <EHRMetric label="Serum Creatinine" value={ehr.creatinine} unit="mg/dL" normal="0.7–1.2" highlight={ehr.creatinine > 1.3} />
            <EHRMetric label="eGFR" value={ehr.gfr} unit="mL/min/1.73m²" normal="> 90" highlight={ehr.gfr < 60} />
          </div>
        </Card>
      )}

      {activeTab === 'medications' && (
        <div className="grid-2 animate-fade-in">
          <Card>
            <CardHeader title="Current Medications" />
            {patient.medications.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>No medications currently listed.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {patient.medications.map((med, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', background: 'var(--clr-surface-2)',
                    borderRadius: 8, border: '1px solid var(--clr-border-light)',
                  }}>
                    <Pill size={14} color="var(--clr-primary-light)" />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{med}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader title="Known Allergies" />
            {patient.allergies.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>No known allergies recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {patient.allergies.map((a, i) => (
                  <span key={i} style={{
                    fontSize: 12, padding: '5px 12px', borderRadius: 20,
                    background: 'var(--clr-risk-high-bg)', color: 'var(--clr-risk-high)',
                    border: '1px solid var(--clr-risk-high-border)', fontWeight: 600,
                  }}>
                    <AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />
                    {a}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card className="animate-fade-in" style={{ padding: 0 }}>
          {history.length === 0 ? (
            <div style={{ padding: 'var(--space-6)' }}>
              <p style={{ textAlign: 'center', color: 'var(--clr-text-muted)' }}>No assessments found for this patient.</p>
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: 'var(--radius-xl)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assessment ID</th>
                    <th>Date</th>
                    <th>Diabetes</th>
                    <th>Heart Disease</th>
                    <th>CKD</th>
                    <th>Stroke</th>
                    <th>Overall</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--clr-primary-light)' }}>{h.id}</td>
                      <td style={{ fontSize: 13 }}>{formatDate(h.date)} · {h.time}</td>
                      <td><RiskBadge risk={h.results.diabetes.risk} /></td>
                      <td><RiskBadge risk={h.results.heartDisease.risk} /></td>
                      <td><RiskBadge risk={h.results.ckd.risk} /></td>
                      <td><RiskBadge risk={h.results.stroke.risk} /></td>
                      <td><RiskBadge risk={h.overallRisk} /></td>
                      <td><StatusPill status={h.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
