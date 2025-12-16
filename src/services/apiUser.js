import { apiRequest } from './api';

export async function getUsers() {
  const response = await apiRequest('/auth/users');
  return response;
}

export async function deleteUser(id) {
  const response = await apiRequest(`/auth/users/${id}`, {
    method: 'DELETE',
  });
  return response;
}
