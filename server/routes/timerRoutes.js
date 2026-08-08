const express = require('express');
const auth = require('../middleware/auth');
const { getTimer, startTimer, ownerTimer } = require('../controllers/timerController');

const router = express.Router();

router.get('/', auth, getTimer);
router.post('/start', auth, startTimer);
router.post('/owner', ownerTimer);

module.exports = router;
