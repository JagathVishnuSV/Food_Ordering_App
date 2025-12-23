const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  currency: { type: String, default: 'USD' }
}, { _id: false });

const PricingRuleSchema = new mongoose.Schema({
  type: { type: String, enum: ['tax', 'discount'], required: true },
  strategy: { type: String, required: true }, // e.g., 'percentage', 'fixed'
  value: { type: Number, required: true } // percent for percentage, amount for fixed
}, { _id: false });

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  menu: [MenuItemSchema],
  pricingRules: [PricingRuleSchema]
}, { timestamps: true });

RestaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', RestaurantSchema);