import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Users, Activity, AlertTriangle, TrendingUp,
  Heart, ArrowRight, Clock, CheckCircle,
} from 'lucide-react';
import { mockPatients, getHighRiskPatients } from '../data/mockPatients';
import { getRecentHistory } from '../data/mockHistory';
import {
  StatCard, RiskBadge, PatientAvatar, Card, CardHeader, DisclaimerBanner,
} from '../components/UIComponents';
import { formatDate, getDiseaseInfo } from '../utils/helpers';

// Chart data
const riskTrendData = [
  { month: 'Apr', high: 3, moderate: 8, low: 12 },
  { month: 'May', high: 4, moderate: 10, low: 14 },
  { month: 'Jun', high: 5, moderate: 9, low: 11 },
  { month: 'Jul', high: 3, moderate: 11, low: 15 },
  { month: 'Aug', high: 6, moderate: 10, low: 12 },
  { month: 'Sep', high: 4, moderate: 12, low: 16 },
];

const diseaseDistributionData = [
  { name: 'Diabetes', value: 5, color: '#7C3AED' },
  { name: 'Heart Disease', value: 4, color: '#DC2626' },
  { name: 'CKD', value: 3, color: '#0284C7' },
  { name: 'Stroke', value: 2, color: '#EA580C' },
];

const weeklyAssessmentsData = [
  { day: 'Mon', assessments: 3 },
  { day: 'Tue', assessments: 5 },
  { day: 'Wed', assessments: 4 },
  { day: 'Thu', assessments: 7 },
  { day: 'Fri', assessments: 6 },
  { day: 'Sat', assessments: 2 },
  { day: 'Sun', assessments: 1 },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white', border: '1px solid var(--clr-border)',
        borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)'
      }}>
        <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ fontSize: 12, color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const highRiskPatients = getHighRiskPatients();
  const recentHistory = getRecentHistory(5);
  const totalPatients = mockPatients.length;
  const highRiskCount = highRiskPatients.length;
  const moderateRiskCount = mockPatients.filter((p) => p.status === 'Moderate Risk').length;

  return (
    <div className="stagger-children">
      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Clinical Dashboard</h1>
          <p className="page-subtitle">
            Overview of patient risk assessments — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/prediction" className="btn btn-primary">
            <Activity size={16} />
            New Risk Assessment
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard
          icon={<Users size={22} />}
          label="Total Patients"
          value={totalPatients}
          change="2 this month"
          changeType="positive"
          iconBg="#EFF6FF"
          iconColor="#2563EB"
        />
        <StatCard
          icon={<AlertTriangle size={22} />}
          label="High Risk Patients"
          value={highRiskCount}
          change="1 new alert"
          changeType="negative"
          iconBg="#FEF2F2"
          iconColor="#DC2626"
        />
        <StatCard
          icon={<Activity size={22} />}
          label="Assessments This Month"
          value={28}
          change="12% vs last month"
          changeType="positive"
          iconBg="#F0FDF4"
          iconColor="#16A34A"
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Model Accuracy"
          value="94.3%"
          change="Transformer v2.1"
          changeType="positive"
          iconBg="#F3F0FF"
          iconColor="#7C3AED"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2-1" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Risk Trend Area Chart */}
        <Card>
          <CardHeader
            title="Risk Level Trends"
            subtitle="Monthly patient distribution by risk category"
            action={
              <span style={{ fontSize: '12px', color: 'var(--clr-text-muted)', background: 'var(--clr-surface-2)', padding: '4px 10px', borderRadius: '6px' }}>
                Apr – Sep 2024
              </span>
            }
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={riskTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="modGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Area type="monotone" dataKey="high" name="High Risk" stroke="#DC2626" fill="url(#highGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="moderate" name="Moderate" stroke="#D97706" fill="url(#modGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="low" name="Low Risk" stroke="#16A34A" fill="url(#lowGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Disease Distribution Pie */}
        <Card>
          <CardHeader
            title="High-Risk by Disease"
            subtitle="Patients with high risk predictions"
          />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={diseaseDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {diseaseDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} patients`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {diseaseDistributionData.map((d) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                  <span style={{ color: 'var(--clr-text-secondary)' }}>{d.name}</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--clr-text-primary)' }}>{d.value} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Weekly Assessments Bar */}
        <Card>
          <CardHeader
            title="Weekly Assessments"
            subtitle="Risk assessments performed this week"
          />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyAssessmentsData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--clr-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="assessments" name="Assessments" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* High Risk Alerts */}
        <Card>
          <CardHeader
            title="High Risk Alerts"
            subtitle={`${highRiskCount} patients requiring attention`}
            action={
              <Link to="/patients" className="btn btn-ghost btn-sm" style={{ color: 'var(--clr-primary-light)', fontSize: 12 }}>
                View All <ArrowRight size={12} />
              </Link>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {highRiskPatients.map((patient) => (
              <Link
                key={patient.id}
                to={`/patients/${patient.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: 'var(--clr-risk-high-bg)',
                  border: '1px solid var(--clr-risk-high-border)',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <PatientAvatar name={patient.name} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--clr-text-primary)' }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--clr-text-muted)' }}>
                    {patient.conditions.join(', ') || 'No conditions listed'}
                  </div>
                </div>
                <RiskBadge risk="High" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Predictions Table */}
      <Card>
        <CardHeader
          title="Recent Predictions"
          subtitle="Latest risk assessments across all patients"
          action={
            <Link to="/history" className="btn btn-secondary btn-sm">
              View Full History
            </Link>
          }
        />
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Diabetes</th>
                <th>Heart Disease</th>
                <th>CKD</th>
                <th>Stroke</th>
                <th>Overall</th>
                <th>Physician</th>
              </tr>
            </thead>
            <tbody>
              {recentHistory.map((record) => (
                <tr
                  key={record.id}
                  className="clickable"
                  onClick={() => window.location.href = `/patients/${record.patientId}`}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <PatientAvatar name={record.patientName} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{record.patientName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--clr-text-muted)' }}>{record.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--clr-text-secondary)', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td><RiskBadge risk={record.results.diabetes.risk} /></td>
                  <td><RiskBadge risk={record.results.heartDisease.risk} /></td>
                  <td><RiskBadge risk={record.results.ckd.risk} /></td>
                  <td><RiskBadge risk={record.results.stroke.risk} /></td>
                  <td><RiskBadge risk={record.overallRisk} /></td>
                  <td style={{ fontSize: '12px', color: 'var(--clr-text-secondary)' }}>{record.physician}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
