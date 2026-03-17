const express = require('express');
const router = express.Router();

// Test route to debug server issues
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
