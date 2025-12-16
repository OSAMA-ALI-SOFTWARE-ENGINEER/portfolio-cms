import { apiRequest, apiFormRequest } from './api';

// Authentication API functions
export async function login({ email, password }) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // Store token in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token);
  }

  return response;
}

export async function register({ name, email, password }) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  // Store token in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token);
  }

  return response;
}

export async function getCurrentUser() {
  try {
    const response = await apiRequest('/auth/me');
    // Return the user object from the response
    return response.user || response;
  } catch (error) {
    // If it's a connection error, don't clear the token
    // Just return null so the user isn't blocked from the UI
    if (error.name === 'ConnectionError') {
      console.warn('Backend server is not available');
      return null;
    }
    // If token is invalid (401), remove it silently
    if (error.status === 401 || (error.message && error.message.includes('authorized'))) {
      localStorage.removeItem('token');
      // Don't log this error as it's expected when user is not authenticated
      return null;
    }
    // For other errors, log but still return null
    console.error('Error getting current user:', error.message);
    return null;
  }
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token from localStorage
    localStorage.removeItem('token');
  }
}

export async function createUser({ name, email, password, avatar }) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  
  if (avatar) {
    formData.append('avatar', avatar);
  }

  const response = await apiFormRequest('/auth/register', formData);

  // Store token in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token);
  }

  return response.user;
}

export async function updateCurrentUser({ name, password, avatar }) {
  if (avatar) {
    // Handle file upload
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (avatar) formData.append('avatar', avatar);

    const response = await apiFormRequest('/auth/update-profile', formData, {
      method: 'PUT',
    });
    return response.user;
  } else {
    // Handle regular update
    const response = await apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
    return response.user;
  }
}

export async function updatePassword({ currentPassword, newPassword }) {
  const response = await apiRequest('/auth/update-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response;
}

export async function checkEmailAvailability(email) {
  const response = await apiRequest('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return response;
}

export async function forgotPassword(email) {
  // Note: This would need to be implemented in the backend
  // For now, we'll keep the existing Supabase implementation
  console.log('Forgot password functionality needs to be implemented in backend');
  throw new Error('Forgot password not yet implemented');
}