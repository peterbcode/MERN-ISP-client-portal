const express = require('express');
const router = express.Router();

// Test endpoint to verify frontend-backend connection
router.post('/test-login', (req, res) => {
  console.log('🧪 Test login request received:', req.body);
  res.json({
    success: true,
    message: 'Test endpoint working',
    received: req.body
  });
});

module.exports = router;
