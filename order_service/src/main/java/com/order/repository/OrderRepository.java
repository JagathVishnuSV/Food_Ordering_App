package com.order.repository;

import com.google.gson.Gson;
import com.order.model.Order;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

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
}