package com.order.model;

import java.util.List;

public class Order {
    public String id;
    public String userId;
    public String restaurantId;
    public List<OrderItem> items;
    public double total;
    public String status;
    public long createdAt = System.currentTimeMillis();
}