const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', auth, upload.single('image'), createMenuItem);
router.put('/:id', auth, upload.single('image'), updateMenuItem);
router.delete('/:id', auth, deleteMenuItem);

module.exports = router;
