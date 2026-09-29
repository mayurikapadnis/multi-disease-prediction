// API service stubs for Patient operations
// TODO: Replace mock data imports with real HTTP calls when backend is available
// Base URL will come from environment variable: import.meta.env.VITE_API_BASE_URL

// import axios from 'axios';
// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

import { mockPatients, getPatientById, getHighRiskPatients } from '../data/mockPatients';

/**
 * Fetch all patients
 * TODO: Replace with: return axios.get(`${API_BASE}/patients`);
 */
export const fetchPatients = async () => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 300));
  return { data: mockPatients, success: true };
};

/**
 * Fetch single patient by ID
 * TODO: Replace with: return axios.get(`${API_BASE}/patients/${id}`);
 */
export const fetchPatientById = async (id) => {
  await new Promise((res) => setTimeout(res, 200));
  const patient = getPatientById(id);
  if (!patient) throw new Error(`Patient ${id} not found`);
  return { data: patient, success: true };
};

/**
 * Search patients by name, ID, or condition
 * TODO: Replace with: return axios.get(`${API_BASE}/patients?search=${query}`);
 */
export const searchPatients = async (query) => {
  await new Promise((res) => setTimeout(res, 200));
  const q = query.toLowerCase();
  const results = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.conditions.some((c) => c.toLowerCase().includes(q))
  );
  return { data: results, success: true };
};

/**
 * Fetch high-risk patients for dashboard alerts
 * TODO: Replace with: return axios.get(`${API_BASE}/patients?risk=high`);
 */
export const fetchHighRiskPatients = async () => {
  await new Promise((res) => setTimeout(res, 200));
  return { data: getHighRiskPatients(), success: true };
};

/**
 * Create a new patient record
 * TODO: Replace with: return axios.post(`${API_BASE}/patients`, patientData);
 */
export const createPatient = async (patientData) => {
  await new Promise((res) => setTimeout(res, 500));
  // Mock creation — in real implementation this would persist to DB
  const newPatient = {
    ...patientData,
    id: `P${String(mockPatients.length + 1).padStart(3, '0')}`,
    registeredDate: new Date().toISOString().split('T')[0],
    status: 'Low Risk',
  };
  return { data: newPatient, success: true };
};
