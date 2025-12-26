import { apiRequest } from './api';

export async function getVisitorStats() {
  // Uses the public stats endpoint we saw in backend/routes/visitors.js
  const response = await apiRequest('/visitors/stats');
  return response.data;
}

export async function updateVisitor(page) {
    const response = await apiRequest('/visitors/update', {
        method: 'POST',
        body: JSON.stringify({ page })
    });
    return response.data;
}
