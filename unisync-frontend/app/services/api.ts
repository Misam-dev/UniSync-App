import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = 'https://unb-roan.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    if (response.data.success && response.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      if (response.data.user.role === 'society') {
        await AsyncStorage.setItem('societyId', response.data.user.id);
      } else if (response.data.user.role === 'student') {
        await AsyncStorage.setItem('studentId', response.data.user.id);
      }
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.clear();
    const response = await api.post('/logout');
    return response.data;
  },
};

export const societyAPI = {
  getDashboard: async (societyId: string) => {
    const response = await api.get(`/api/mobile/society/dashboard?societyId=${societyId}`);
    return response.data;
  },

  addEvent: async (eventData: FormData) => {
    const response = await api.post('/api/mobile/society/add-event', eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEvent: async (eventId: string, eventData: FormData) => {
    const response = await api.put(`/api/mobile/event/${eventId}`, eventData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/api/mobile/event/${eventId}`);
    return response.data;
  },

  getParticipants: async (eventId: string) => {
    const response = await api.get(`/api/mobile/event/${eventId}/participants`);
    return response.data;
  },
};

export const studentAPI = {
  getDashboard: async (studentId: string) => {
    const response = await api.get(`/api/mobile/student/dashboard?studentId=${studentId}`);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await api.get('/api/mobile/student/events');
    return response.data;
  },

  joinEvent: async (eventId: string, studentId: string) => {
    const response = await api.post(`/api/mobile/student/join-event/${eventId}`, { studentId });
    return response.data;
  },

  leaveEvent: async (eventId: string, studentId: string) => {
    const response = await api.post(`/api/mobile/student/leave-event/${eventId}`, { studentId });
    return response.data;
  },

  getMyEvents: async (studentId: string) => {
    const response = await api.get(`/api/mobile/student/${studentId}/events`);
    return response.data;
  },
};

export const eventAPI = {
  getEvent: async (eventId: string) => {
    const response = await api.get(`/api/mobile/event/${eventId}`);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await api.get('/api/mobile/events');
    return response.data;
  },
};

export default api;
export { API_BASE_URL };
