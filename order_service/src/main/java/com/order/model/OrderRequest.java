package com.order.model;

import java.util.List;

public class OrderRequest {
    public String userId;
    public String restaurantId;
    public List<OrderItem> items;

    public double calculateTotal() {
        return items.stream().mapToDouble(i -> i.price * i.qty).sum();
    }
}