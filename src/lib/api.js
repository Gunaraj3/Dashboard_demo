const API_BASE_URL = '/api/proxy/v1';
console.log('API_BASE_URL:', API_BASE_URL);

const AUTH_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const inflightRequests = new Map();

// Auth Helpers
const authHelpers = {
  getToken: () => typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null,
  getRefreshToken: () => typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  setTokens: (accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
};

async function handleResponse(response, silent = false) {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    // Handle Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        authHelpers.clearTokens();
        window.location.href = '/login';
      }
    }

    if (!silent) console.error(`API Error on ${response.url}:`, errorMessage);
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      try {
        const text = await response.text();
        if (text && text.length < 200) errorMessage = text;
      } catch (textError) {
        // use default message
      } 
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// Helper to get headers with Auth
function getHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = authHelpers.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function dedupFetch(url, options = {}) {
  const method = options.method || 'GET';
  
  // Add auth headers
  options.headers = getHeaders(options.headers || {});

  // Only dedup GET requests
  if (method !== 'GET') {
    return fetch(url, options).then(handleResponse);
  }

  if (inflightRequests.has(url)) {
    return inflightRequests.get(url);
  }

  const promise = fetch(url, options)
    .then(res => handleResponse(res))
    .finally(() => {
      inflightRequests.delete(url);
    });

  inflightRequests.set(url, promise);
  return promise;
}

export const api = {
  // Client (Line) endpoints
  clients: {
    list: () => {
      console.log(`Fetching: ${API_BASE_URL}/clients/client`);
      return dedupFetch(`${API_BASE_URL}/clients/client`);
    },
    get: (id) => dedupFetch(`${API_BASE_URL}/clients/client/${id}`),
    create: (data) => fetch(`${API_BASE_URL}/clients/client`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_BASE_URL}/clients/client/${id}`, {
      method: 'PATCH',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE_URL}/clients/client/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.status === 204 ? { success: true } : handleResponse(res)),
  },

  // Camera endpoints
  cameras: {
    listByClient: (clientId) => dedupFetch(`${API_BASE_URL}/camera/camera/by-client/${clientId}`),
    getById: (id) => dedupFetch(`${API_BASE_URL}/camera/camera/by-id/${id}`),
    checkStatus: () => dedupFetch(`${API_BASE_URL}/camera/camera/availabilty`),
    getAvailability: (cameraId, date) => dedupFetch(`${API_BASE_URL}/camera/cameras/${cameraId}/availability/daily?date=${date}`),
    getAvailabilityRange: (cameraId, startDate, endDate) => dedupFetch(`${API_BASE_URL}/camera/cameras/${cameraId}/availability/daily-range?start_date=${startDate}&end_date=${endDate}`),
    getSchedules: (cameraId) => dedupFetch(`${API_BASE_URL}/camera/${cameraId}/camera-schedule`),
    createSchedule: (cameraId, data) => fetch(`${API_BASE_URL}/camera/${cameraId}/camera-schedule`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(handleResponse),
    updateSchedule: (scheduleId, data) => fetch(`${API_BASE_URL}/camera/${scheduleId}/camera-schedule`, {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data),
    }).then(handleResponse),
    deleteSchedule: (scheduleId) => fetch(`${API_BASE_URL}/camera/${scheduleId}/camera-schedule`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.status === 204 ? { success: true } : handleResponse(res)),
  },

  // OCR Data (Reports) endpoints
  ocrData: {
    list: () => dedupFetch(`${API_BASE_URL}/ocr_data/ocr-data`),
    getByCamera: (cameraId) => dedupFetch(`${API_BASE_URL}/ocr_data/ocr-data-camera/${cameraId}`),
    listByCamera: (cameraId, params = {}) => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        page_size: params.page_size || 50,
      });
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.start_time) queryParams.append('start_time', params.start_time);
      if (params.end_time) queryParams.append('end_time', params.end_time);
      if (params.shift) queryParams.append('shift', params.shift);

      const url = `${API_BASE_URL}/ocr_data/list-camera-ocr-data/${cameraId}?${queryParams.toString()}`;
      return dedupFetch(url);
    },
    getById: (id) => dedupFetch(`${API_BASE_URL}/ocr_data/ocr-data/${id}`),
    getStatsDayWise: (cameraId, startDate, endDate) => 
      dedupFetch(`${API_BASE_URL}/ocr_data/ocr-data/${cameraId}/day-wise?start_date=${startDate}&end_date=${endDate}`),
    getStatsShiftWise: (cameraId, startDate, endDate) => 
      dedupFetch(`${API_BASE_URL}/ocr_data/ocr-date/${cameraId}/shift-wise?start_date=${startDate}&end_date=${endDate}`),
    exportReport: (cameraId, params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.start_time) queryParams.append('start_time', params.start_time);
      if (params.end_time) queryParams.append('end_time', params.end_time);
      if (params.shift) queryParams.append('shift', params.shift);

      const url = `${API_BASE_URL}/ocr_data/export-ocr-data/${cameraId}?${queryParams.toString()}`;
      return fetch(url, { headers: getHeaders() }).then(async (res) => {
        if (!res.ok) throw new Error(`Export failed: ${res.statusText}`);
        return res;
      });
    },
    listByClient: (clientId, params = {}) => {
      const queryParams = new URLSearchParams({
        client_id: clientId,
        page: params.page || 1,
        page_size: params.page_size || 50,
      });
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);
      if (params.start_time) queryParams.append('start_time', params.start_time);
      if (params.end_time) queryParams.append('end_time', params.end_time);
      if (params.shift) queryParams.append('shift', params.shift);

      const url = `${API_BASE_URL}/ocr_data/list-client-ocr-data/${clientId}?${queryParams.toString()}`;
      return dedupFetch(url);
    }
  },
  
  // Auth endpoints
  auth: {
    login: (username, password) => {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      return fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }).then(handleResponse).then(response => {
        authHelpers.setTokens(response.access_token, response.refresh_token);
        return response;
      });
    },
    logout: () => {
      authHelpers.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    refreshToken: (token) => fetch(`${API_BASE_URL}/user/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token }),
    }).then(handleResponse).then(response => {
      authHelpers.setTokens(response.access_token, response.refresh_token);
      return response;
    }),
  },
}; 
