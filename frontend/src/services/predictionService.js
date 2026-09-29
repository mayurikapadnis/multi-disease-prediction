// API service stubs for Prediction operations
// TODO: Replace mock data with real HTTP calls to backend ML inference endpoint

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

import { mockPredictionHistory, getHistoryByPatient, getRecentHistory } from '../data/mockHistory';

/**
 * Run risk prediction for a patient based on EHR input
 * TODO: Replace with: return axios.post(`${API_BASE}/predict`, ehrData);
 * The backend should run the Transformer model and return predictions + SHAP values
 */
export const runPrediction = async (ehrData) => {
  await new Promise((res) => setTimeout(res, 1500)); // Simulate model inference time

  // Mock prediction logic based on input values
  const diabetesRisk = calculateMockRisk([
    ehrData.hba1c > 7 ? 0.3 : ehrData.hba1c > 5.7 ? 0.15 : 0,
    ehrData.glucose > 200 ? 0.25 : ehrData.glucose > 125 ? 0.12 : 0,
    ehrData.bmi > 30 ? 0.15 : ehrData.bmi > 25 ? 0.07 : 0,
    ehrData.familyHistoryDiabetes ? 0.1 : 0,
    ehrData.age > 45 ? 0.08 : 0,
    ehrData.physicalActivity === 'Low' ? 0.07 : 0,
  ]);

  const heartRisk = calculateMockRisk([
    ehrData.cholesterol > 240 ? 0.2 : ehrData.cholesterol > 200 ? 0.1 : 0,
    ehrData.systolicBP > 140 ? 0.18 : ehrData.systolicBP > 120 ? 0.08 : 0,
    ehrData.age > 50 ? 0.12 : 0,
    ehrData.smoking === 'Current' ? 0.15 : ehrData.smoking === 'Former' ? 0.06 : 0,
    ehrData.bmi > 30 ? 0.1 : 0,
    ehrData.familyHistoryHeartDisease ? 0.1 : 0,
  ]);

  const ckdRisk = calculateMockRisk([
    ehrData.creatinine > 1.5 ? 0.3 : ehrData.creatinine > 1.2 ? 0.15 : 0,
    ehrData.gfr < 60 ? 0.25 : ehrData.gfr < 90 ? 0.1 : 0,
    ehrData.systolicBP > 140 ? 0.12 : 0,
    ehrData.hba1c > 7 ? 0.1 : 0,
    ehrData.age > 60 ? 0.08 : 0,
  ]);

  const strokeRisk = calculateMockRisk([
    ehrData.atrialFibrillation ? 0.3 : 0,
    ehrData.systolicBP > 140 ? 0.15 : ehrData.systolicBP > 130 ? 0.07 : 0,
    ehrData.age > 60 ? 0.12 : 0,
    ehrData.smoking === 'Current' ? 0.12 : 0,
    ehrData.familyHistoryStroke ? 0.1 : 0,
    diabetesRisk > 0.5 ? 0.08 : 0,
  ]);

  const toRiskLevel = (p) => (p >= 0.65 ? 'High' : p >= 0.35 ? 'Moderate' : 'Low');

  const results = {
    diabetes: { risk: toRiskLevel(diabetesRisk), probability: parseFloat(diabetesRisk.toFixed(2)) },
    heartDisease: { risk: toRiskLevel(heartRisk), probability: parseFloat(heartRisk.toFixed(2)) },
    ckd: { risk: toRiskLevel(ckdRisk), probability: parseFloat(ckdRisk.toFixed(2)) },
    stroke: { risk: toRiskLevel(strokeRisk), probability: parseFloat(strokeRisk.toFixed(2)) },
  };

  const allProbs = [diabetesRisk, heartRisk, ckdRisk, strokeRisk];
  const maxRisk = Math.max(...allProbs);
  const overallRisk = toRiskLevel(maxRisk);

  return {
    data: {
      id: `PRED-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      results,
      overallRisk,
      confidence: 0.87,
    },
    success: true,
  };
};

const calculateMockRisk = (factors) => {
  const base = 0.05;
  const sum = factors.reduce((a, b) => a + b, 0);
  return Math.min(0.97, base + sum + (Math.random() * 0.04 - 0.02));
};

/**
 * Fetch prediction history for all patients
 * TODO: Replace with: return axios.get(`${API_BASE}/history`);
 */
export const fetchPredictionHistory = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return { data: mockPredictionHistory, success: true };
};

/**
 * Fetch prediction history for a specific patient
 * TODO: Replace with: return axios.get(`${API_BASE}/history?patientId=${patientId}`);
 */
export const fetchPatientHistory = async (patientId) => {
  await new Promise((res) => setTimeout(res, 200));
  return { data: getHistoryByPatient(patientId), success: true };
};

/**
 * Fetch recent predictions for dashboard
 * TODO: Replace with: return axios.get(`${API_BASE}/history?limit=${n}`);
 */
export const fetchRecentPredictions = async (n = 5) => {
  await new Promise((res) => setTimeout(res, 200));
  return { data: getRecentHistory(n), success: true };
};
