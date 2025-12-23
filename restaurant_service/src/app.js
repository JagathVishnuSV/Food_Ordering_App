require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const restaurantsRouter = require('./routes/restaurant');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/restaurants', restaurantsRouter);

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ ok: state === 1, mongoState: states[state] || state, service: 'restaurant_service' });
});

module.exports = app;