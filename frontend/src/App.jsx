import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import RiskPrediction from './pages/RiskPrediction';
import Explainability from './pages/Explainability';
import PredictionHistory from './pages/PredictionHistory';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/prediction" element={<RiskPrediction />} />
          <Route path="/explainability" element={<Explainability />} />
          <Route path="/history" element={<PredictionHistory />} />
          <Route path="/reports" element={<Reports />} />
          {/* Catch-all: redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
