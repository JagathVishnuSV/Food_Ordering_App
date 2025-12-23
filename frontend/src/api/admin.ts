import apiClient from './client';

const adminHeaders = () => {
  const secret = localStorage.getItem('adminSecret') || '';
  return secret ? { 'x-admin-secret': secret } : {};
};

export const adminApi = {
  login: async (secret: string) => {
    // simple validation against env value on frontend
    const expected = import.meta.env.VITE_ADMIN_SECRET;
    if (expected && secret !== expected) {
      throw new Error('Invalid admin secret');
    }
    localStorage.setItem('adminSecret', secret);
    return true;
  },

  createRestaurant: async (payload: {
    name: string;
    category: string;
    location: { coordinates: number[] };
  }) => {
    const response = await apiClient.post('/api/restaurants/admin/restaurants', payload, {
      headers: adminHeaders(),
    });
    return response.data;
  },

  addMenuItem: async (restaurantId: string, item: {
    name: string;
    description: string;
    price: number;
    currency?: string;
  }) => {
    const response = await apiClient.post(`/api/restaurants/admin/restaurants/${restaurantId}/menu`, item, {
      headers: adminHeaders(),
    });
    return response.data;
  },
};
