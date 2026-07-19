const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const router = express.Router();

router.post('/', auth, upload.single('image'), createMenuItem);
router.put('/:id', auth, upload.single('image'), updateMenuItem);
router.delete('/:id', auth, deleteMenuItem);

module.exports = router;
