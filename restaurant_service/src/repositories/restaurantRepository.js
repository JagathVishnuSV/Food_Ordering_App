const Restaurant = require('../models/Restaurant');

class RestaurantRepository {
  async create(data) {
    const r = new Restaurant(data);
    return r.save();
  }

  async list(filter = {}, limit = 50) {
    return Restaurant.find(filter).limit(limit).exec();
  }

  async findById(id) {
    return Restaurant.findById(id).exec();
  }

  async updatePricing(id, pricingRules) {
    return Restaurant.findByIdAndUpdate(id, { pricingRules }, { new: true }).exec();
  }
}

module.exports = new RestaurantRepository();