// API service stubs for XAI (Explainability) operations
// TODO: Replace with real SHAP/Integrated Gradients values from backend

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

import { mockXAIData, getDiseaseXAI } from '../data/mockXAI';

/**
 * Fetch explainability data for a given prediction
 * TODO: Replace with: return axios.get(`${API_BASE}/explain/${predictionId}`);
 * Backend should return SHAP values and natural language explanation from the model
 */
export const fetchExplanation = async (predictionId, patientId) => {
  await new Promise((res) => setTimeout(res, 800));
  return { data: mockXAIData, success: true };
};

/**
 * Fetch disease-specific explanation
 * TODO: Replace with: return axios.get(`${API_BASE}/explain/${predictionId}/${disease}`);
 */
export const fetchDiseaseExplanation = async (disease, predictionId) => {
  await new Promise((res) => setTimeout(res, 500));
  const data = getDiseaseXAI(disease);
  if (!data) throw new Error(`No explanation for disease: ${disease}`);
  return { data, success: true };
};
