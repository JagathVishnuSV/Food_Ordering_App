const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  label: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  addresses: [AddressSchema]
}, { timestamps: true });

UserSchema.index({ 'addresses.location': '2dsphere' });

module.exports = mongoose.model('User', UserSchema);