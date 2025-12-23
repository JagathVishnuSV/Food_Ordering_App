const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthService {
  async register({ name, email, password }) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new Error('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name, email, password: hashed });
    return this._sanitize(user);
  }

  async login({ email, password }) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { token, user: this._sanitize(user) };
  }

  async getProfile(userId) {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error('User not found');
    return this._sanitize(user);
  }

  async addAddress(userId, address) {
    const updated = await userRepo.addAddress(userId, address);
    return this._sanitize(updated);
  }

  _sanitize(user) {
    if (!user) return null;
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }
}

module.exports = new AuthService();