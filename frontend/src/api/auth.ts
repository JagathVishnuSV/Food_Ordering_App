import apiClient from './client';
import type { User, AuthResponse, Address } from '../types';

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post<User>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  },

  addAddress: async (address: Omit<Address, 'location'> & { location?: Address['location'] }) => {
    const response = await apiClient.post<User>('/api/auth/address', address);
    return response.data;
  },
};
