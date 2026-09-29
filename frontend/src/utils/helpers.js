// Utility functions for the CDSS frontend

/**
 * Get color class/hex for risk level
 */
export const getRiskColor = (risk) => {
  switch (risk) {
    case 'High': return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', badge: 'risk-badge--high' };
    case 'Moderate': return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', badge: 'risk-badge--moderate' };
    case 'Low': return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0', badge: 'risk-badge--low' };
    default: return { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB', badge: 'risk-badge--unknown' };
  }
};

/**
 * Get disease display information
 */
export const getDiseaseInfo = (diseaseKey) => {
  const map = {
    diabetes: { label: 'Diabetes', icon: '🩸', color: '#7C3AED', colorLight: '#F3F0FF' },
    heartDisease: { label: 'Heart Disease', icon: '❤️', color: '#DC2626', colorLight: '#FFF0F0' },
    ckd: { label: 'Kidney Disease (CKD)', icon: '🫘', color: '#0284C7', colorLight: '#F0F9FF' },
    stroke: { label: 'Stroke', icon: '🧠', color: '#EA580C', colorLight: '#FFF7F0' },
  };
  return map[diseaseKey] || { label: diseaseKey, icon: '📊', color: '#6B7280', colorLight: '#F9FAFB' };
};

/**
 * Format probability as percentage string
 */
export const formatProbability = (prob) => `${Math.round(prob * 100)}%`;

/**
 * Format date to readable string
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Calculate overall risk from prediction results
 */
export const getOverallRisk = (results) => {
  const risks = Object.values(results);
  if (risks.some((r) => r.risk === 'High')) return 'High';
  if (risks.some((r) => r.risk === 'Moderate')) return 'Moderate';
  return 'Low';
};

/**
 * Get initials from full name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get age from date of birth
 */
export const calculateAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

/**
 * Debounce function for search inputs
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Truncate text to given length
 */
export const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n - 3) + '...' : str;
