import { apiRequest } from './api';

// Contact API functions
export async function sendContactMessage({ name, email, phoneNumber, message }) {
  const response = await apiRequest('/contact/send', {
    method: 'POST',
    body: JSON.stringify({ name, email, phoneNumber, message }),
  });
  return response;
}

export async function getContactMessages(page = 1, limit = 10, isRead = null) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (isRead !== null) {
    params.append('isRead', isRead.toString());
  }

  const response = await apiRequest(`/contact/messages?${params.toString()}`);
  return {
    data: response.data,
    count: response.count,
    total: response.total,
    page: response.page,
    pages: response.pages
  };
}

export async function getContactMessage(id) {
  const response = await apiRequest(`/contact/messages/${id}`);
  return response.data;
}

export async function replyToContactMessage(id, replyMessage) {
  const response = await apiRequest(`/contact/messages/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ replyMessage }),
  });
  return response;
}

export async function deleteContactMessage(id) {
  const response = await apiRequest(`/contact/messages/${id}`, {
    method: 'DELETE',
  });
  return response;
}
