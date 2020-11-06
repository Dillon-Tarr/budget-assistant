const { BlacklistedToken } = require('../models/blacklistedToken');
const express = require('express');
const router = express.Router();

router.delete('/old-tokens', async (req, res) => {
  try {
    const now = Date.now();
    const oneDayAgo = now - 86400000;
    const oldTokens = await BlacklistedToken.find({ blacklistedTime: {$lt: oneDayAgo } });
    for (let i = 0; i < oldTokens.length; i++){
      await BlacklistedToken.findByIdAndDelete(oldTokens[i]._id);
    }
    
    return res.send("Old blacklisted tokens deleted successfully.");

  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;