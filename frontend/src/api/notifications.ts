import apiClient from './client';
import type { Notification } from '../types';

export const notificationApi = {
  getAll: async () => {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  getByUserId: async (userId: string) => {
    const response = await apiClient.get<Notification[]>(`/notifications/${userId}`);
    return response.data;
  },
};
