import apiClient from './client';
import type { DeliveryAssignment } from '../types';

export const deliveryApi = {
  getAssignments: async () => {
    const response = await apiClient.get<DeliveryAssignment[]>('/delivery/assignments');
    return response.data;
  },

  getAssignment: async (orderId: string) => {
    const response = await apiClient.get<DeliveryAssignment>(`/delivery/assignments/${orderId}`);
    return response.data;
  },
};
