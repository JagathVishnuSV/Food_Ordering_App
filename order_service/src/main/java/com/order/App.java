package com.order;

import com.order.controller.OrderController;
import com.order.messaging.RabbitPublisher;
import com.order.repository.OrderRepository;
import com.order.client.RestaurantClient;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.javalin.Javalin;

public class App {
    public static void main(String[] args) throws Exception {
        String portStr = System.getenv().getOrDefault("PORT", "8080");
        int port = Integer.parseInt(portStr);

        String mongoUri = System.getenv().getOrDefault("MONGO_URI", "mongodb+srv://jagath:jagath08@cluster0.sgk5s43.mongodb.net/orders_db?retryWrites=true&w=majority");
        MongoClient mongoClient = MongoClients.create(mongoUri);

        String rabbitUrl = System.getenv().getOrDefault("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672");
        RabbitPublisher publisher = new RabbitPublisher(rabbitUrl, "food_orders");

        String restaurantUrl = System.getenv().getOrDefault("RESTAURANT_SERVICE_URL", "http://restaurant-service:3001");

        OrderRepository orderRepo = new OrderRepository(mongoClient, "orders_db", "orders");
        RestaurantClient restaurantClient = new RestaurantClient(restaurantUrl);

        Javalin app = Javalin.create(config -> {
            config.defaultContentType = "application/json";
        });

        // Global CORS + preflight handling
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*");
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            ctx.header("Access-Control-Allow-Credentials", "true");
            if ("OPTIONS".equalsIgnoreCase(ctx.method())) {
                ctx.status(204).result("");
            }
        });

        app.start(port);

        new OrderController(app, orderRepo, restaurantClient, publisher);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                publisher.close();
                mongoClient.close();
                app.stop();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }));

        System.out.println("Order Service started on port " + port);
    }
}