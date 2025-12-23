import apiClient from './client';
import type { Order, OrderRequest } from '../types';

export const orderApi = {
  placeOrder: async (orderData: OrderRequest) => {
    const response = await apiClient.post<Order>('/order', orderData);
    return response.data;
  },
};
