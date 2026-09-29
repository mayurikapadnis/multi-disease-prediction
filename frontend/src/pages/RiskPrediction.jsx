import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Activity, ChevronDown, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { mockPatients } from '../data/mockPatients';
import { runPrediction } from '../services/predictionService';
import {
  RiskBadge, RiskProgressBar, Card, CardHeader,
  DisclaimerBanner, LoadingSpinner,
} from '../components/UIComponents';
import { getDiseaseInfo } from '../utils/helpers';

const SMOKING_OPTIONS = ['Never', 'Former', 'Current'];
const ACTIVITY_OPTIONS = ['High', 'Moderate', 'Low', 'Sedentary'];

const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: 'var(--space-6)' }}>
    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--clr-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--clr-primary-100)', display: 'flex', alignItems: 'center', gap: 6 }}>
      {title}
    </h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {children}
    </div>
  </div>
);

const FormField = ({ label, required, hint, children }) => (
  <div className="form-group">
    <label className="form-label">
      {label}{required && <span className="required">*</span>}
    </label>
    {children}
    {hint && <span className="form-hint">{hint}</span>}
  </div>
);

const RiskResultCard = ({ diseaseKey, result }) => {
  const info = getDiseaseInfo(diseaseKey);
  const pct = Math.round(result.probability * 100);
  return (
    <div className={`risk-result-card ${result.risk.toLowerCase()} animate-scale-in`}>
      <div className="risk-result-card-header">
        <div className="risk-result-disease">
          <div className="risk-result-icon" style={{ background: info.colorLight }}>
            {info.icon}
          </div>
          <div>
            <div className="risk-result-disease-name" style={{ color: info.color }}>
              {info.label}
            </div>
            <RiskBadge risk={result.risk} />
          </div>
        </div>
        <div className="risk-result-probability">
          <div className="risk-result-prob-value" style={{ color: result.risk === 'High' ? 'var(--clr-risk-high)' : result.risk === 'Moderate' ? 'var(--clr-risk-moderate)' : 'var(--clr-risk-low)' }}>
            {pct}%
          </div>
          <div className="risk-result-prob-label">probability</div>
        </div>
      </div>
      <RiskProgressBar probability={result.probability} risk={result.risk} label="Risk Score" />
    </div>
  );
};

export default function RiskPrediction() {
  const [searchParams] = useSearchParams();
  const preselectedPatient = searchParams.get('patient') || '';

  const [formData, setFormData] = useState({
    patientId: preselectedPatient,
    age: '',
    gender: 'Male',
    glucose: '',
    hba1c: '',
    systolicBP: '',
    diastolicBP: '',
    bmi: '',
    cholesterol: '',
    triglycerides: '',
    creatinine: '',
    gfr: '',
    smoking: 'Never',
    alcohol: 'None',
    physicalActivity: 'Moderate',
    familyHistoryDiabetes: false,
    familyHistoryHeartDisease: false,
    familyHistoryStroke: false,
    atrialFibrillation: false,
  });

  const [predicting, setPredicting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill from patient if selected
  useEffect(() => {
    if (formData.patientId) {
      const patient = mockPatients.find((p) => p.id === formData.patientId);
      if (patient) {
        const [sys, dia] = patient.ehr.bloodPressure.split('/');
        setFormData((prev) => ({
          ...prev,
          age: patient.age,
          gender: patient.gender,
          glucose: patient.ehr.glucose,
          hba1c: patient.ehr.hba1c,
          systolicBP: sys,
          diastolicBP: dia,
          bmi: patient.ehr.bmi,
          cholesterol: patient.ehr.cholesterol,
          triglycerides: patient.ehr.triglycerides,
          creatinine: patient.ehr.creatinine,
          gfr: patient.ehr.gfr,
          smoking: patient.ehr.smoking,
          physicalActivity: patient.ehr.physicalActivity,
          familyHistoryDiabetes: patient.ehr.familyHistory.includes('Diabetes'),
          familyHistoryHeartDisease: patient.ehr.familyHistory.includes('Heart Disease'),
          familyHistoryStroke: patient.ehr.familyHistory.includes('Stroke'),
        }));
        setAutoFilled(true);
        setResults(null);
      }
    }
  }, [formData.patientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setError(null);
    setResults(null);
    try {
      const res = await runPrediction({ ...formData });
      setResults(res.data);
    } catch (err) {
      setError('Prediction failed. Please check your inputs and try again.');
    } finally {
      setPredicting(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  const diseases = ['diabetes', 'heartDisease', 'ckd', 'stroke'];

  return (
    <div className="animate-fade-in">
      <DisclaimerBanner />

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Risk Prediction</h1>
          <p className="page-subtitle">
            Enter clinical and EHR parameters to generate multi-disease risk predictions
          </p>
        </div>
      </div>

      <div className="grid-2-1" style={{ alignItems: 'flex-start' }}>
        {/* Left: Form */}
        <form onSubmit={handleSubmit}>
          <Card style={{ marginBottom: 'var(--space-5)' }}>
            <CardHeader title="Patient Information" subtitle="Select an existing patient or enter manually" />

            <FormSection title="👤 Patient Selection">
              <FormField label="Select Patient" hint="Auto-fills EHR data from records">
                <select
                  className="form-input form-select"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  id="patient-select"
                >
                  <option value="">— Manual Entry —</option>
                  {mockPatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Age" required>
                <input
                  className="form-input"
                  type="number"
                  name="age"
                  min={1} max={120}
                  placeholder="e.g. 54"
                  value={formData.age}
                  onChange={handleChange}
                  id="input-age"
                />
              </FormField>
              <FormField label="Gender" required>
                <select className="form-input form-select" name="gender" value={formData.gender} onChange={handleChange} id="input-gender">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </FormField>
            </FormSection>

            {autoFilled && (
              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                <CheckCircle size={16} className="alert-icon" />
                EHR data auto-filled from patient records. Review and adjust if needed.
              </div>
            )}

            <FormSection title="🩸 Glycemic Markers">
              <FormField label="Fasting Glucose" required hint="mg/dL · Normal: 70–100">
                <input className="form-input" type="number" name="glucose" min={40} max={600} placeholder="e.g. 126" value={formData.glucose} onChange={handleChange} id="input-glucose" />
              </FormField>
              <FormField label="HbA1c" hint="% · Normal: < 5.7%">
                <input className="form-input" type="number" step="0.1" name="hba1c" min={3} max={20} placeholder="e.g. 6.5" value={formData.hba1c} onChange={handleChange} id="input-hba1c" />
              </FormField>
            </FormSection>

            <FormSection title="💓 Cardiovascular Markers">
              <FormField label="Systolic BP" required hint="mmHg · Normal: < 120">
                <input className="form-input" type="number" name="systolicBP" min={60} max={250} placeholder="e.g. 130" value={formData.systolicBP} onChange={handleChange} id="input-systolic" />
              </FormField>
              <FormField label="Diastolic BP" hint="mmHg · Normal: < 80">
                <input className="form-input" type="number" name="diastolicBP" min={40} max={150} placeholder="e.g. 85" value={formData.diastolicBP} onChange={handleChange} id="input-diastolic" />
              </FormField>
              <FormField label="Total Cholesterol" hint="mg/dL · Normal: < 200">
                <input className="form-input" type="number" name="cholesterol" min={100} max={600} placeholder="e.g. 215" value={formData.cholesterol} onChange={handleChange} id="input-cholesterol" />
              </FormField>
              <FormField label="Triglycerides" hint="mg/dL · Normal: < 150">
                <input className="form-input" type="number" name="triglycerides" min={50} max={1000} placeholder="e.g. 160" value={formData.triglycerides} onChange={handleChange} id="input-triglycerides" />
              </FormField>
              <FormField label="BMI" required hint="kg/m² · Normal: 18.5–24.9">
                <input className="form-input" type="number" step="0.1" name="bmi" min={10} max={70} placeholder="e.g. 27.4" value={formData.bmi} onChange={handleChange} id="input-bmi" />
              </FormField>
            </FormSection>

            <FormSection title="🫘 Renal Markers">
              <FormField label="Serum Creatinine" hint="mg/dL · Normal: 0.7–1.2">
                <input className="form-input" type="number" step="0.1" name="creatinine" min={0.3} max={20} placeholder="e.g. 1.1" value={formData.creatinine} onChange={handleChange} id="input-creatinine" />
              </FormField>
              <FormField label="eGFR" hint="mL/min/1.73m² · Normal: > 90">
                <input className="form-input" type="number" name="gfr" min={5} max={150} placeholder="e.g. 75" value={formData.gfr} onChange={handleChange} id="input-gfr" />
              </FormField>
            </FormSection>

            <FormSection title="🌿 Lifestyle & History">
              <FormField label="Smoking Status">
                <select className="form-input form-select" name="smoking" value={formData.smoking} onChange={handleChange} id="input-smoking">
                  {SMOKING_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Physical Activity Level">
                <select className="form-input form-select" name="physicalActivity" value={formData.physicalActivity} onChange={handleChange} id="input-activity">
                  {ACTIVITY_OPTIONS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </FormField>
            </FormSection>

            {/* Checkboxes */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--clr-primary)', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--clr-primary-100)' }}>
                ⚠️ Risk Flags
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {[
                  { name: 'familyHistoryDiabetes', label: 'Family History — Diabetes' },
                  { name: 'familyHistoryHeartDisease', label: 'Family History — Heart Disease' },
                  { name: 'familyHistoryStroke', label: 'Family History — Stroke' },
                  { name: 'atrialFibrillation', label: 'Atrial Fibrillation Diagnosed' },
                ].map((cb) => (
                  <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--clr-surface-2)', borderRadius: 8, cursor: 'pointer', border: `1px solid ${formData[cb.name] ? 'var(--clr-risk-moderate-border)' : 'var(--clr-border-light)'}`, transition: 'all 0.2s' }}>
                    <input
                      type="checkbox"
                      name={cb.name}
                      checked={formData[cb.name]}
                      onChange={handleChange}
                      style={{ width: 16, height: 16, accentColor: 'var(--clr-primary-light)' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--clr-text-primary)', fontWeight: 500 }}>{cb.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error" style={{ marginBottom: 16 }}>
                <AlertCircle size={16} className="alert-icon" />
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${predicting ? 'btn-loading' : ''}`}
                style={{ flex: 1 }}
                disabled={predicting}
                id="run-prediction-btn"
              >
                {predicting ? (
                  <>
                    <div className="btn-spinner" />
                    Analyzing Risk...
                  </>
                ) : (
                  <>
                    <Activity size={18} />
                    Run Risk Prediction
                  </>
                )}
              </button>
              {results && (
                <button type="button" className="btn btn-secondary" onClick={handleReset}>
                  Reset
                </button>
              )}
            </div>
          </Card>
        </form>

        {/* Right: Results */}
        <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 24px)' }}>
          {predicting && (
            <Card>
              <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
                <h3 style={{ marginBottom: 8 }}>Running Analysis</h3>
                <p style={{ color: 'var(--clr-text-muted)', fontSize: 13, marginBottom: 20 }}>
                  Transformer model is processing clinical parameters...
                </p>
                <div className="spinner" style={{ margin: '0 auto' }} />
              </div>
            </Card>
          )}

          {results && !predicting && (
            <div className="stagger-children">
              {/* Overall Risk */}
              <Card style={{ marginBottom: 16, borderTop: `4px solid ${results.overallRisk === 'High' ? 'var(--clr-risk-high)' : results.overallRisk === 'Moderate' ? 'var(--clr-risk-moderate)' : 'var(--clr-risk-low)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>Overall Risk Assessment</h3>
                  <RiskBadge risk={results.overallRisk} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--clr-text-muted)' }}>
                  <span>Model Confidence: <strong>{Math.round(results.confidence * 100)}%</strong></span>
                  <span>Assessment: <strong>{new Date().toLocaleDateString('en-IN')}</strong></span>
                </div>
              </Card>

              {/* Disease Results */}
              <Card style={{ marginBottom: 16, padding: 'var(--space-5)' }}>
                <CardHeader title="Disease-wise Risk Predictions" subtitle="Probability scores from Transformer model" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {diseases.map((d) => (
                    <RiskResultCard key={d} diseaseKey={d} result={results.results[d]} />
                  ))}
                </div>
              </Card>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to="/explainability" className="btn btn-primary" style={{ flex: 1 }}>
                  View XAI Explanation
                </Link>
                <Link to="/history" className="btn btn-secondary" style={{ flex: 1 }}>
                  View History
                </Link>
              </div>
            </div>
          )}

          {!results && !predicting && (
            <Card>
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-title">Ready to Predict</div>
                <div className="empty-state-description">
                  Fill in the clinical parameters and click "Run Risk Prediction" to generate multi-disease risk scores.
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
