import apiClient from './client';
import type { Order, OrderRequest } from '../types';

export const orderApi = {
  placeOrder: async (orderData: OrderRequest) => {
    const response = await apiClient.post<Order>('/order', orderData);
    return response.data;
  },

  getUserOrders: async (userId: string) => {
    const response = await apiClient.get<Order[]>(`/orders/${userId}`);
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await apiClient.get<Order>(`/order/${orderId}`);
    return response.data;
  },
};
