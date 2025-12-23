package com.order.messaging;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class RabbitPublisher implements AutoCloseable {
    private final ConnectionFactory factory;
    private final Connection connection;
    private final Channel channel;
    private final String exchange;

    public RabbitPublisher(String rabbitUrl, String exchange) throws Exception {
        this.factory = new ConnectionFactory();
        factory.setUri(rabbitUrl);
        this.connection = factory.newConnection();
        this.channel = connection.createChannel();
        this.exchange = exchange;
        channel.exchangeDeclare(exchange, "topic", true);
    }

    public void publish(String routingKey, String message) throws Exception {
        channel.basicPublish(exchange, routingKey, null, message.getBytes());
    }

    @Override
    public void close() throws Exception {
        channel.close();
        connection.close();
    }
}