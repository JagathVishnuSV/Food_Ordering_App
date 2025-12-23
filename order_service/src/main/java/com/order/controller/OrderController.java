package com.order.controller;

import com.google.gson.Gson;
import com.order.client.RestaurantClient;
import com.order.messaging.RabbitPublisher;
import com.order.model.Order;
import com.order.model.OrderRequest;
import com.order.repository.OrderRepository;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.UUID;

public class OrderController {
    private final OrderRepository repo;
    private final RestaurantClient restaurantClient;
    private final RabbitPublisher publisher;
    private final Gson gson = new Gson();

    public OrderController(Javalin app, OrderRepository repo, RestaurantClient restaurantClient, RabbitPublisher publisher) {
        this.repo = repo;
        this.restaurantClient = restaurantClient;
        this.publisher = publisher;

        app.post("/order", this::placeOrder);
        app.get("/orders/{userId}", this::getUserOrders);
        app.get("/order/{orderId}", this::getOrder);
        app.get("/health", ctx -> ctx.json(new HealthResponse(true)));
    }

    private void placeOrder(Context ctx) {
        try {
            OrderRequest req = gson.fromJson(ctx.body(), OrderRequest.class);
            if (req == null || req.restaurantId == null || req.items == null || req.items.isEmpty()) {
                ctx.status(400).json(new ErrorResponse("invalid_request"));
                return;
            }

            // Validate with restaurant service
            boolean ok = restaurantClient.validateOrderPrices(req);
            if (!ok) {
                ctx.status(400).json(new ErrorResponse("price_mismatch"));
                return;
            }

            Order order = new Order();
            order.id = UUID.randomUUID().toString();
            order.userId = req.userId;
            order.restaurantId = req.restaurantId;
            order.items = req.items;
            order.status = "CREATED";
            order.total = req.calculateTotal();

            repo.save(order);

            // publish event
            publisher.publish("order.placed", gson.toJson(new OrderPlacedEvent(order.id, order.status, order.total)));

            ctx.status(201).json(order);
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json(new ErrorResponse("server_error"));
        }
    }

    private void getUserOrders(Context ctx) {
        try {
            String userId = ctx.pathParam("userId");
            ctx.json(repo.findByUserId(userId));
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json(new ErrorResponse("server_error"));
        }
    }

    private void getOrder(Context ctx) {
        try {
            String orderId = ctx.pathParam("orderId");
            Order order = repo.findById(orderId);
            if (order == null) {
                ctx.status(404).json(new ErrorResponse("order_not_found"));
                return;
            }
            ctx.json(order);
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).json(new ErrorResponse("server_error"));
        }
    }

    static class HealthResponse {
        public boolean ok;
        public HealthResponse(boolean ok) { this.ok = ok; }
    }
    static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }
    static class OrderPlacedEvent {
        public String orderId;
        public String status;
        public double total;
        public OrderPlacedEvent(String orderId, String status, double total) {
            this.orderId = orderId; this.status = status; this.total = total;
        }
    }
}