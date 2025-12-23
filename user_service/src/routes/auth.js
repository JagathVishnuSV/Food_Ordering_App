const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const auth = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/address', auth, async (req, res) => {
  try {
    const updated = await authService.addAddress(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;