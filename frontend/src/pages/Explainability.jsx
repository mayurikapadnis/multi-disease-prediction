import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { Brain, Info, TrendingUp, TrendingDown, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { mockXAIData } from '../data/mockXAI';
import { Card, CardHeader, RiskBadge, DisclaimerBanner } from '../components/UIComponents';
import { getDiseaseInfo } from '../utils/helpers';

const DISEASES = ['diabetes', 'heartDisease', 'ckd', 'stroke'];

const FeatureImportanceBar = ({ feature, maxShap, index }) => {
  const pct = Math.abs(feature.shap) / maxShap * 100;
  return (
    <div
      className="feature-bar animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="feature-bar-label" style={{ minWidth: 180, maxWidth: 180 }}>
        <div className="feature-bar-name">{feature.feature}</div>
        <div className="feature-bar-value">
          {typeof feature.value === 'number' ? feature.value : String(feature.value)}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="feature-bar-track">
          <div
            className={`feature-bar-fill feature-bar-fill--${feature.direction}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className={`feature-bar-shap ${feature.direction}`}>
        {feature.direction === 'positive' ? '+' : ''}{feature.shap.toFixed(2)}
      </div>
      <div style={{ color: feature.direction === 'positive' ? 'var(--clr-risk-high)' : 'var(--clr-risk-low)', flexShrink: 0 }}>
        {feature.direction === 'positive' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      </div>
    </div>
  );
};

const WaterfallTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div style={{
        background: 'white', border: '1px solid var(--clr-border)',
        borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', maxWidth: 240,
      }}>
        <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{d.feature}</p>
        <p style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginBottom: 4 }}>Value: {d.value}</p>
        <p style={{ fontSize: 12, color: d.shap > 0 ? 'var(--clr-risk-high)' : 'var(--clr-risk-low)', fontWeight: 600 }}>
          SHAP: {d.shap > 0 ? '+' : ''}{d.shap.toFixed(3)}
        </p>
        <p style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginTop: 4, lineHeight: 1.4 }}>{d.description}</p>
      </div>
    );
  }
  return null;
};

export default function Explainability() {
  const [activeDisease, setActiveDisease] = useState('diabetes');
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);

  const xaiData = mockXAIData[activeDisease];
  const info = getDiseaseInfo(activeDisease);
  const features = showAllFeatures ? xaiData.topFeatures : xaiData.topFeatures.slice(0, 6);
  const maxShap = Math.max(...xaiData.topFeatures.map((f) => Math.abs(f.shap)));

  const positiveFeatures = xaiData.topFeatures.filter((f) => f.direction === 'positive');
  const negativeFeatures = xaiData.topFeatures.filter((f) => f.direction === 'negative');

  // Bar chart data
  const barData = xaiData.topFeatures.slice(0, 8).map((f) => ({
    feature: f.feature.length > 18 ? f.feature.slice(0, 18) + '...' : f.feature,
    fullFeature: f.feature,
    shap: f.direction === 'positive' ? f.shap : -Math.abs(f.shap),
    value: f.value,
    description: f.description,
    direction: f.direction,
  }));

  return (
    <div className="animate-fade-in">
      <DisclaimerBanner />

      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">
            <Brain size={26} style={{ display: 'inline', marginRight: 10, color: 'var(--clr-primary)' }} />
            Explainability (XAI)
          </h1>
          <p className="page-subtitle">
            Transformer model explanations using SHAP feature importance — understand why each prediction was made
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/prediction" className="btn btn-primary">
            Run New Prediction
          </Link>
        </div>
      </div>

      {/* Disease Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {DISEASES.map((d) => {
          const dInfo = getDiseaseInfo(d);
          const isActive = activeDisease === d;
          return (
            <button
              key={d}
              onClick={() => { setActiveDisease(d); setShowAllFeatures(false); setExpandedFeature(null); }}
              className="btn"
              style={{
                padding: '10px 20px',
                background: isActive ? dInfo.color : 'white',
                color: isActive ? 'white' : 'var(--clr-text-secondary)',
                border: `1px solid ${isActive ? dInfo.color : 'var(--clr-border)'}`,
                borderRadius: 10,
                fontWeight: isActive ? 600 : 500,
                fontSize: 13,
                boxShadow: isActive ? `0 4px 12px ${dInfo.color}33` : 'none',
                transition: 'all 0.2s',
              }}
            >
              {dInfo.icon} {dInfo.label}
            </button>
          );
        })}
      </div>

      {/* Model Info Card */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="card" style={{ borderLeft: `4px solid ${info.color}`, padding: 'var(--space-4)' }}>
          <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', fontWeight: 500, marginBottom: 2 }}>Model</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{xaiData.modelName}</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', fontWeight: 500, marginBottom: 2 }}>Model Accuracy</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-success)' }}>{(xaiData.modelAccuracy * 100).toFixed(1)}%</div>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', fontWeight: 500, marginBottom: 2 }}>AUC-ROC Score</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--clr-primary-light)' }}>{xaiData.modelAUC.toFixed(3)}</div>
        </div>
      </div>

      <div className="grid-2-1" style={{ alignItems: 'flex-start' }}>
        {/* Left: Feature Importance */}
        <div>
          {/* Bar Chart */}
          <Card style={{ marginBottom: 'var(--space-5)' }}>
            <CardHeader
              title="SHAP Feature Importance"
              subtitle="Positive values increase risk (red) · Negative values reduce risk (green)"
              action={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--clr-text-muted)' }}>
                  <Info size={13} /> SHAP Values
                </div>
              }
            />
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--clr-border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} domain={[-0.35, 0.35]} tickFormatter={(v) => v.toFixed(2)} />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: 'var(--clr-text-secondary)' }} width={140} axisLine={false} tickLine={false} />
                <Tooltip content={<WaterfallTooltip />} />
                <ReferenceLine x={0} stroke="var(--clr-text-muted)" strokeWidth={1} />
                <Bar dataKey="shap" radius={[0, 4, 4, 0]} maxBarSize={16}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.direction === 'positive' ? '#DC2626' : '#16A34A'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Feature Table */}
          <Card>
            <CardHeader
              title="Detailed Feature Contributions"
              subtitle={`${xaiData.topFeatures.length} features analyzed`}
              action={
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  style={{ fontSize: 12, color: 'var(--clr-primary-light)' }}
                >
                  {showAllFeatures ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All</>}
                </button>
              }
            />
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--clr-risk-high)' }} />
                  <span style={{ color: 'var(--clr-text-secondary)' }}>Increases risk ({positiveFeatures.length} features)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--clr-risk-low)' }} />
                  <span style={{ color: 'var(--clr-text-secondary)' }}>Reduces risk ({negativeFeatures.length} features)</span>
                </div>
              </div>
            </div>
            <div>
              {features.map((feature, i) => (
                <div key={feature.feature}>
                  <FeatureImportanceBar feature={feature} maxShap={maxShap} index={i} />
                  {/* Expandable description */}
                  <div
                    style={{
                      marginLeft: 200, fontSize: 11, color: 'var(--clr-text-muted)',
                      padding: '2px 0 8px', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Info size={11} />
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Natural Language + Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Natural Language Explanation */}
          <Card style={{ borderTop: `4px solid ${info.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: info.colorLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {info.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: info.color }}>{info.label}</h3>
                <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>Clinical Explanation</div>
              </div>
            </div>
            <div style={{
              background: info.colorLight, borderRadius: 10,
              padding: 'var(--space-4)', fontSize: 13,
              color: 'var(--clr-text-primary)', lineHeight: 1.8,
              border: `1px solid ${info.color}22`,
            }}>
              <BookOpen size={14} style={{ display: 'inline', marginRight: 6, color: info.color }} />
              {xaiData.naturalLanguage}
            </div>
          </Card>

          {/* Top Positive Factors */}
          <Card>
            <CardHeader
              title="⬆ Risk-Increasing Factors"
              subtitle="These features push risk higher"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {positiveFeatures.slice(0, 4).map((f, i) => (
                <div key={f.feature} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', background: 'var(--clr-risk-high-bg)',
                  borderRadius: 8, border: '1px solid var(--clr-risk-high-border)',
                }}>
                  <TrendingUp size={14} color="var(--clr-risk-high)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{f.feature}</div>
                    <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>
                      Value: {f.value} · SHAP: +{f.shap.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Negative Factors */}
          {negativeFeatures.length > 0 && (
            <Card>
              <CardHeader
                title="⬇ Protective Factors"
                subtitle="These features help reduce risk"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {negativeFeatures.map((f, i) => (
                  <div key={f.feature} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', background: 'var(--clr-risk-low-bg)',
                    borderRadius: 8, border: '1px solid var(--clr-risk-low-border)',
                  }}>
                    <TrendingDown size={14} color="var(--clr-risk-low)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{f.feature}</div>
                      <div style={{ fontSize: 11, color: 'var(--clr-text-muted)' }}>
                        Value: {f.value} · SHAP: {f.shap.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Model Info */}
          <Card style={{ background: 'var(--clr-surface-2)', border: '1px solid var(--clr-border)' }}>
            <div style={{ fontSize: 11, color: 'var(--clr-text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--clr-text-primary)' }}>ℹ About SHAP Values</strong><br />
              SHAP (SHapley Additive exPlanations) values measure each feature's contribution to the model's prediction relative to the baseline prediction. Positive SHAP values indicate the feature increases predicted risk; negative values indicate it reduces risk.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
