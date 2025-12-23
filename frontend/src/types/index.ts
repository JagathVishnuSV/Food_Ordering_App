// Backend contract types based on service analysis

export interface Address {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  category: string;
  location: {
    type: string;
    coordinates: number[];
  };
  menu: MenuItem[];
  pricingRules: PricingRule[];
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  currency: string;
  finalPrice?: number;
}

export interface PricingRule {
  type: 'tax' | 'discount';
  strategy: string;
  value: number;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
  menuItemId?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: number;
}

export interface OrderRequest {
  userId: string;
  restaurantId: string;
  items: OrderItem[];
}

export interface DeliveryAssignment {
  orderId: string;
  status: string;
  rider_id: string | null;
  location: number[];
  start: number[];
  dest: number[];
  progress: number;
  created_at: number;
}

export interface Notification {
  userId: string;
  payload: {
    title: string;
    message: any;
    routingKey: string;
  };
  sent_at: number;
  delivered: boolean;
  transport: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}
