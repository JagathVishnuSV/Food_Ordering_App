require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);

app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected,1 connected,2 connecting,3 disconnecting
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({ ok: state === 1, mongoState: states[state] || state, service: 'user_service' });
});

module.exports = app;