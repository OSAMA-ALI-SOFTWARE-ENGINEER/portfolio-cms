// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    let data;
    try {
      const text = await response.text();
      // Only try to parse if there's content
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      // If response is not JSON, create a meaningful error
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      // Include status code in error for handling
      const error = new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const friendlyError = new Error(
        'Cannot connect to the server. Please make sure the backend server is running on http://localhost:5000'
      );
      friendlyError.name = 'ConnectionError';
      console.error('API Request Error: Backend server is not running or not accessible');
      console.error('💡 Make sure to start the backend server: cd backend && npm run dev');
      throw friendlyError;
    }
    
    // Handle other errors
    console.error('API Request Error:', error);
    throw error;
  }
};

// Helper function for form data requests (file uploads)
const apiFormRequest = async (endpoint, formData, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: formData,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    let data;
    try {
      const text = await response.text();
      // Only try to parse if there's content
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      // If response is not JSON, create a meaningful error
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      // Include status code in error for handling
      const error = new Error(data.message || `Server error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      const friendlyError = new Error(
        'Cannot connect to the server. Please make sure the backend server is running on http://localhost:5000'
      );
      friendlyError.name = 'ConnectionError';
      console.error('API Form Request Error: Backend server is not running or not accessible');
      console.error('💡 Make sure to start the backend server: cd backend && npm run dev');
      throw friendlyError;
    }
    
    // Handle other errors
    console.error('API Form Request Error:', error);
    throw error;
  }
};

export { apiRequest, apiFormRequest, API_BASE_URL };
