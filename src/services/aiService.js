/**
 * AI Service to communicate with the Node.js backend
 */

export const login = async (username, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return data;
};

export const fetchReports = async (token) => {
  const response = await fetch('/api/reports', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return [];
  return await response.json();
};

export const fetchReportById = async (id, token) => {
  const response = await fetch(`/api/reports/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Report not found');
  return await response.json();
};

export const deleteReport = async (id, token) => {
  const response = await fetch(`/api/reports/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  // In serverless environments, memory is ephemeral. 
  // If it returns 404, it's already "deleted" from that instance's memory, so we treat it as success.
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to delete report');
  }
  
  // Only parse JSON if there's actually a body, or just return success
  return { success: true };
};

export const processMedicalReport = async (file, token) => {
  if (!file) throw new Error('No file provided');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/analyze', {
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
