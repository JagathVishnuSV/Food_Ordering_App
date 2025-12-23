package com.order.client;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.order.model.OrderRequest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

public class RestaurantClient {
    private final String baseUrl;
    private final HttpClient client = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public RestaurantClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public boolean validateOrderPrices(OrderRequest req) {
        try {
            String url = baseUrl + "/api/restaurants/" + req.restaurantId;
            HttpRequest httpReq = HttpRequest.newBuilder()
                    .uri(URI.create(url)).GET().build();
            HttpResponse<String> resp = client.send(httpReq, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) return false;

            JsonObject restaurant = gson.fromJson(resp.body(), JsonObject.class);
            JsonArray menu = restaurant.getAsJsonArray("menu");
            Map<String, Double> priceMap = new HashMap<>();
            for (JsonElement e : menu) {
                JsonObject mi = e.getAsJsonObject();
                String name = mi.get("name").getAsString();
                double price = mi.get("price").getAsDouble();
                priceMap.put(name, price);
            }

            double expected = 0.0;
            for (var item : req.items) {
                Double current = priceMap.get(item.name);
                if (current == null) return false;
                if (Double.compare(current, item.price) != 0) return false;
                expected += current * item.qty;
            }

            return Double.compare(expected, req.calculateTotal()) == 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}