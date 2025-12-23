import apiClient from './client';
import type { Restaurant } from '../types';

export const restaurantApi = {
  getAll: async () => {
    const response = await apiClient.get<Restaurant[]>('/api/restaurants');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Restaurant>(`/api/restaurants/${id}`);
    return response.data;
  },
};
