import { apiRequest } from './api';

// Visitor counter API functions
export async function updateVisitors(route) {
  const homepageVisit = localStorage.getItem("homePageVisit");
  const featurePageVisit = localStorage.getItem("featurePageVisit");
  const blogPageVisit = localStorage.getItem("blogPageVisit");
  const resumePageVisit = localStorage.getItem("resumePageVisit");
  const contactPageVisit = localStorage.getItem("contactPageVisit");

  // Check if user has already visited this page in this session
  const hasVisited = {
    '/': homepageVisit,
    '/features': featurePageVisit,
    '/blog': blogPageVisit,
    '/resume': resumePageVisit,
    '/contacts': contactPageVisit
  };

  if (hasVisited[route]) {
    return; // Don't update counter if already visited
  }

  try {
    const response = await apiRequest('/visitors/update', {
      method: 'POST',
      body: JSON.stringify({ page: route }),
    });

    // Mark page as visited in localStorage
    switch (route) {
      case '/':
        localStorage.setItem("homePageVisit", true);
        break;
      case '/features':
        localStorage.setItem("featurePageVisit", true);
        break;
      case '/blog':
        localStorage.setItem("blogPageVisit", true);
        break;
      case '/resume':
        localStorage.setItem("resumePageVisit", true);
        break;
      case '/contacts':
        localStorage.setItem("contactPageVisit", true);
        break;
      default:
        break;
    }

    return response.data;
  } catch (error) {
    console.error('Failed to update visitor counter:', error);
    // Don't throw error to prevent breaking the app
  }
}

export async function getAllVisitors() {
  const response = await apiRequest('/visitors/stats');
  return response.data;
}

export async function getVisitorAnalytics() {
  const response = await apiRequest('/visitors/analytics');
  return response.data;
}

export async function updateDeviceInfo(deviceType, browser) {
  try {
    await apiRequest('/visitors/device-info', {
      method: 'POST',
      body: JSON.stringify({ deviceType, browser }),
    });
  } catch (error) {
    console.error('Failed to update device info:', error);
    // Don't throw error to prevent breaking the app
  }
}

// Helper function to detect device type
export function detectDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/tablet|ipad/.test(userAgent)) {
    return 'tablet';
  } else if (/mobile|android|iphone/.test(userAgent)) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}

// Helper function to detect browser
export function detectBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  } else if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  } else if (userAgent.includes('edg')) {
    return 'edge';
  } else {
    return 'other';
  }
}