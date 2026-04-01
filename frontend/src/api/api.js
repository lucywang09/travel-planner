import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalize error messages from the server or network layer
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Trips ────────────────────────────────────────────────────────────────────

export const tripsApi = {
  /** GET /trips */
  getAll: () => apiClient.get('/trips'),

  /** POST /trips */
  create: (data) => apiClient.post('/trips', data),

  /** DELETE /trips/:id */
  remove: (id) => apiClient.delete(`/trips/${id}`),
};

// ─── Activities ───────────────────────────────────────────────────────────────

export const activitiesApi = {
  /** GET /trips/:tripId/activities */
  getByTrip: (tripId) => apiClient.get(`/trips/${tripId}/activities`),

  /** POST /trips/:tripId/activities */
  create: (tripId, data) => apiClient.post(`/trips/${tripId}/activities`, data),

  /** DELETE /activities/:id */
  remove: (id) => apiClient.delete(`/activities/${id}`),
};
