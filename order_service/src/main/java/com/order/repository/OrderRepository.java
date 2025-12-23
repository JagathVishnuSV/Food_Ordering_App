package com.order.repository;

import com.google.gson.Gson;
import com.order.model.Order;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Sorts.descending;

public class OrderRepository {
    private final MongoCollection<Document> coll;
    private final Gson gson = new Gson();

    public OrderRepository(MongoClient client, String dbName, String collName) {
        MongoDatabase db = client.getDatabase(dbName);
        this.coll = db.getCollection(collName);
    }

    public void save(Order order) {
        Document doc = Document.parse(gson.toJson(order));
        coll.insertOne(doc);
    }

    public List<Order> findByUserId(String userId) {
        List<Order> orders = new ArrayList<>();
        for (Document doc : coll.find(eq("userId", userId)).sort(descending("createdAt"))) {
            orders.add(gson.fromJson(doc.toJson(), Order.class));
        }
        return orders;
    }

    public Order findById(String orderId) {
        Document doc = coll.find(eq("id", orderId)).first();
        if (doc == null) return null;
        return gson.fromJson(doc.toJson(), Order.class);
    }
}