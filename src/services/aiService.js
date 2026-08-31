/**
 * AI Service to communicate with the Node.js backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return data;
};

export const fetchReports = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/reports`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return [];
  return await response.json();
};

export const fetchReportById = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Report not found');
  return await response.json();
};

export const processMedicalReport = async (file, token) => {
  if (!file) throw new Error('No file provided');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing medical report:", error);
    throw error;
  }
};
