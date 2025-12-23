const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async findByEmail(email) {
    return User.findOne({ email }).exec();
  }

  async findById(id) {
    return User.findById(id).exec();
  }

  async addAddress(userId, address) {
    return User.findByIdAndUpdate(userId, { $push: { addresses: address } }, { new: true }).exec();
  }
}

module.exports = new UserRepository();