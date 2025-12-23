const express = require('express');
const router = express.Router();
const repo = require('../repositories/restaurantRepository');
const admin = require('../middleware/adminMiddleware');
const { calculateFinalPrice } = require('../services/pricingStrategy');

// Public: list restaurants
router.get('/', async (req, res) => {
  try {
    const list = await repo.list({}, 100);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: get restaurant with menu and calculated final prices
router.get('/:id', async (req, res) => {
  try {
    const r = await repo.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    const menuWithFinal = r.menu.map(item => ({
      ...item.toObject(),
      finalPrice: calculateFinalPrice(item, r.pricingRules)
    }));
    res.json({ ...r.toObject(), menu: menuWithFinal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create restaurant
router.post('/admin/restaurants', admin, async (req, res) => {
  try {
    const created = await repo.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: add menu item
router.post('/admin/restaurants/:id/menu', admin, async (req, res) => {
  try {
    const updated = await repo.addMenuItem(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: replace pricing rules for a restaurant
router.post('/admin/:id/pricing', admin, async (req, res) => {
  try {
    const rules = req.body.pricingRules || [];
    const updated = await repo.updatePricing(req.params.id, rules);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;