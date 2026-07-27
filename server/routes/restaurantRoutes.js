const express = require('express');
const auth = require('../middleware/auth');
const {
  getRestaurantInfo,
  updateRestaurantInfo,
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurantInfo);
router.put('/', auth, updateRestaurantInfo);

module.exports = router;
