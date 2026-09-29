import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { Download, FileText, Printer, Share2, ChevronDown, AlertTriangle } from 'lucide-react';
import { mockPatients } from '../data/mockPatients';
import {
  RiskBadge, RiskProgressBar, PatientAvatar, Card, CardHeader,
  DisclaimerBanner,
} from '../components/UIComponents';
import { formatDate, getDiseaseInfo } from '../utils/helpers';

const riskDistData = [
  { name: 'High Risk', value: 3, color: '#DC2626' },
  { name: 'Moderate Risk', value: 3, color: '#D97706' },
  { name: 'Low Risk', value: 2, color: '#16A34A' },
];

const diseaseRiskAvgData = [
  { disease: 'Diabetes', avg: 52, high: 37, moderate: 38, low: 25 },
  { disease: 'Heart Disease', avg: 47, high: 25, moderate: 50, low: 25 },
  { disease: 'CKD', avg: 31, high: 12, moderate: 38, low: 50 },
  { disease: 'Stroke', avg: 38, high: 25, moderate: 38, low: 37 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ fontSize: 12, color: p.color }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ReportSection = ({ title, badge, children }) => (
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
      {badge}
    </div>
    {children}
  </div>
);

export default function Reports() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const diseases = ['diabetes', 'heartDisease', 'ckd', 'stroke'];
  const lastPred = selectedPatient.lastPrediction;

  // Radar chart data
  const radarData = diseases.map((d) => ({
    subject: getDiseaseInfo(d).label.replace(' Disease', '').replace(' (CKD)', ''),
    risk: Math.round((lastPred?.[d]?.probability || 0) * 100),
    fullMark: 100,
  }));

  return (
    <div className="animate-fade-in">
      <DisclaimerBanner />

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Clinical Reports</h1>
          <p className="page-subtitle">Patient risk summaries and population-level insights</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Print Report
          </button>
          <button
            className={`btn btn-primary ${generating ? 'btn-loading' : ''}`}
            onClick={handleGenerate}
            disabled={generating}
            id="generate-report-btn"
          >
            {generating ? (
              <><div className="btn-spinner" /> Generating...</>
            ) : (
              <><Download size={15} /> Export PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Patient Selector */}
      <Card style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-text-secondary)', flexShrink: 0 }}>
            Patient Report For:
          </span>
          <select
            className="form-input form-select"
            style={{ maxWidth: 280 }}
            value={selectedPatient.id}
            onChange={(e) => setSelectedPatient(mockPatients.find((p) => p.id === e.target.value))}
            id="report-patient-select"
          >
            {mockPatients.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--clr-surface-2)', borderRadius: 8 }}>
            <PatientAvatar name={selectedPatient.name} size="sm" />
            <div style={{ fontSize: 12 }}>
              <strong>{selectedPatient.name}</strong>
              <span style={{ color: 'var(--clr-text-muted)', marginLeft: 6 }}>
                {selectedPatient.age}y · {selectedPatient.gender} · {selectedPatient.mrn}
              </span>
            </div>
            <RiskBadge risk={selectedPatient.status.replace(' Risk', '')} />
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <div className="grid-2-1" style={{ alignItems: 'flex-start' }}>
        {/* Left: Patient Report */}
        <div>
          {/* Patient Summary */}
          <Card style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginBottom: 4 }}>PATIENT RISK SUMMARY REPORT</div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selectedPatient.name}</h2>
                <div style={{ fontSize: 13, color: 'var(--clr-text-secondary)' }}>
                  {selectedPatient.mrn} · {selectedPatient.age}y {selectedPatient.gender} · {selectedPatient.bloodGroup}
                </div>
                <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 4 }}>
                  Last assessment: {formatDate(lastPred?.date || selectedPatient.lastVisit)} ·
                  Physician: {selectedPatient.primaryPhysician}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginBottom: 4 }}>OVERALL RISK</div>
                <RiskBadge risk={selectedPatient.status.replace(' Risk', '')} />
              </div>
            </div>

            {/* Active Conditions */}
            {selectedPatient.conditions.length > 0 && (
              <div style={{ background: 'var(--clr-surface-2)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--clr-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Diagnoses</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedPatient.conditions.map((c) => (
                    <span key={c} style={{ fontSize: 12, padding: '4px 12px', background: 'var(--clr-primary-50)', color: 'var(--clr-primary)', borderRadius: 20, border: '1px solid var(--clr-primary-100)', fontWeight: 500 }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Scores */}
            <ReportSection title="Risk Prediction Results">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {diseases.map((d) => {
                  const pred = lastPred?.[d];
                  const info = getDiseaseInfo(d);
                  return (
                    <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: info.colorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {info.icon}
                      </div>
                      <div style={{ minWidth: 140, fontSize: 13, fontWeight: 500 }}>{info.label}</div>
                      <div style={{ flex: 1 }}>
                        <RiskProgressBar probability={pred?.probability || 0} risk={pred?.risk || 'Low'} label="" showLabel={false} />
                      </div>
                      <div style={{ minWidth: 40, textAlign: 'right', fontSize: 14, fontWeight: 700, color: pred?.risk === 'High' ? 'var(--clr-risk-high)' : pred?.risk === 'Moderate' ? 'var(--clr-risk-moderate)' : 'var(--clr-risk-low)' }}>
                        {Math.round((pred?.probability || 0) * 100)}%
                      </div>
                      <RiskBadge risk={pred?.risk || 'Low'} showDot={false} />
                    </div>
                  );
                })}
              </div>
            </ReportSection>

            {/* Key EHR Values */}
            <ReportSection title="Key Clinical Values">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Glucose', value: `${selectedPatient.ehr.glucose}`, unit: 'mg/dL', alert: selectedPatient.ehr.glucose > 125 },
                  { label: 'HbA1c', value: `${selectedPatient.ehr.hba1c}`, unit: '%', alert: selectedPatient.ehr.hba1c > 6.5 },
                  { label: 'BP', value: selectedPatient.ehr.bloodPressure, unit: 'mmHg', alert: parseInt(selectedPatient.ehr.bloodPressure) > 130 },
                  { label: 'BMI', value: `${selectedPatient.ehr.bmi}`, unit: 'kg/m²', alert: selectedPatient.ehr.bmi > 30 },
                  { label: 'Cholesterol', value: `${selectedPatient.ehr.cholesterol}`, unit: 'mg/dL', alert: selectedPatient.ehr.cholesterol > 240 },
                  { label: 'Triglycerides', value: `${selectedPatient.ehr.triglycerides}`, unit: 'mg/dL', alert: selectedPatient.ehr.triglycerides > 200 },
                  { label: 'Creatinine', value: `${selectedPatient.ehr.creatinine}`, unit: 'mg/dL', alert: selectedPatient.ehr.creatinine > 1.2 },
                  { label: 'eGFR', value: `${selectedPatient.ehr.gfr}`, unit: 'mL/min', alert: selectedPatient.ehr.gfr < 60 },
                ].map((item) => (
                  <div key={item.label} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: item.alert ? 'var(--clr-risk-high-bg)' : 'var(--clr-surface-2)',
                    border: `1px solid ${item.alert ? 'var(--clr-risk-high-border)' : 'var(--clr-border-light)'}`,
                  }}>
                    <div style={{ fontSize: 10, color: 'var(--clr-text-muted)', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: item.alert ? 'var(--clr-risk-high)' : 'var(--clr-text-primary)' }}>
                      {item.value}
                      <span style={{ fontSize: 9, fontWeight: 400, marginLeft: 2, color: 'var(--clr-text-muted)' }}>{item.unit}</span>
                    </div>
                    {item.alert && <div style={{ fontSize: 9, color: 'var(--clr-risk-high)', marginTop: 2 }}>⚠ Abnormal</div>}
                  </div>
                ))}
              </div>
            </ReportSection>

            {/* Recommendations */}
            <ReportSection title="Clinical Recommendations">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  selectedPatient.ehr.hba1c > 7 && '📋 Glycemic management required — consider medication review or dosage adjustment',
                  parseInt(selectedPatient.ehr.bloodPressure) > 140 && '💊 Blood pressure control needed — review antihypertensive therapy',
                  selectedPatient.ehr.cholesterol > 240 && '🫀 Dyslipidemia management — lipid-lowering therapy consideration',
                  selectedPatient.ehr.bmi > 30 && '🏃 Weight management program recommended — lifestyle and dietary intervention',
                  selectedPatient.ehr.gfr < 60 && '🫘 Nephrology referral advised — monitor renal function closely',
                  selectedPatient.status === 'High Risk' && '⚠️ Urgent multi-disciplinary review recommended within 2 weeks',
                ].filter(Boolean).map((rec, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: 'var(--clr-surface-2)', borderRadius: 8, fontSize: 13, color: 'var(--clr-text-primary)', border: '1px solid var(--clr-border-light)' }}>
                    {rec}
                  </div>
                ))}
                {selectedPatient.status === 'Low Risk' && (
                  <div style={{ padding: '10px 14px', background: 'var(--clr-risk-low-bg)', borderRadius: 8, fontSize: 13, color: 'var(--clr-risk-low)', border: '1px solid var(--clr-risk-low-border)' }}>
                    ✅ Patient shows low risk across all disease categories. Annual screening and lifestyle maintenance recommended.
                  </div>
                )}
              </div>
            </ReportSection>

            {/* Disclaimer */}
            <div style={{ padding: '10px 14px', background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 8, fontSize: 11, color: '#78350F', lineHeight: 1.6 }}>
              <strong>⚠️ Disclaimer:</strong> This report is generated by an AI-assisted clinical decision support system and is intended to aid — not replace — professional medical judgment. All clinical decisions must be made by a qualified healthcare professional.
            </div>
          </Card>
        </div>

        {/* Right: Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Radar Chart */}
          <Card>
            <CardHeader title="Risk Radar" subtitle="Multi-disease risk profile" />
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
                <PolarGrid stroke="var(--clr-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--clr-text-secondary)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--clr-text-muted)' }} tickCount={4} />
                <Radar
                  name="Risk %"
                  dataKey="risk"
                  stroke="var(--clr-primary-light)"
                  fill="var(--clr-primary-light)"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--clr-primary-light)' }}
                />
                <Tooltip formatter={(v) => [`${v}%`, 'Risk']} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Population Distribution */}
          <Card>
            <CardHeader title="Population Risk Distribution" subtitle="All 8 registered patients" />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskDistData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={({ name, value }) => `${value}`} labelLine={false}>
                  {riskDistData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} patients`, n]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Disease Prevalence */}
          <Card>
            <CardHeader title="Disease Risk Averages" subtitle="Average risk score across all patients" />
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={diseaseRiskAvgData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" vertical={false} />
                <XAxis dataKey="disease" tick={{ fontSize: 10, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="high" name="High %" stackId="a" fill="#DC2626" opacity={0.85} />
                <Bar dataKey="moderate" name="Moderate %" stackId="a" fill="#D97706" opacity={0.85} />
                <Bar dataKey="low" name="Low %" stackId="a" fill="#16A34A" opacity={0.85} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Future Features Notice */}
          <Card style={{ background: 'var(--clr-surface-2)', borderStyle: 'dashed', borderColor: 'var(--clr-border)' }}>
            <div style={{ textAlign: 'center', padding: '12px 8px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🚧</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-text-primary)', marginBottom: 4 }}>More Features Coming</div>
              <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
                Longitudinal trend tracking, PDF export, lab result comparison charts, and physician sign-off workflow will be available once the backend is integrated.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
