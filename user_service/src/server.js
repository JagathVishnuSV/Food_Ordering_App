const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI not set. See .env');
  process.exit(1);
}

const mongooseOptions = {
  // Mongoose v7 has sensible defaults; include options for clarity
  autoIndex: true,
  serverSelectionTimeoutMS: 10000
};

async function connectWithRetry(retries = 5, delayMs = 2000) {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`User Service listening on ${PORT}`);
    });
  } catch (err) {
    console.error(`Mongo connection failed: ${err.message}`);
    if (retries <= 0) {
      console.error('No retries left — exiting');
      process.exit(1);
    }
    console.log(`Retrying Mongo connection in ${delayMs}ms (${retries} retries left)`);
    setTimeout(() => connectWithRetry(retries - 1, Math.min(delayMs * 2, 30000)), delayMs);
  }
}

connectWithRetry();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received, closing Mongo connection');
  await mongoose.disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing Mongo connection');
  await mongoose.disconnect();
  process.exit(0);
});