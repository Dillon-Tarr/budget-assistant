const { BlacklistedToken } = require('../models/blacklistedToken');

async function cleanTokenBlacklist(){
  const oneDayAgo = Date.now() - 86400000;
  const oldTokens = await BlacklistedToken.find({ blacklistedTime: {$lt: oneDayAgo } });
  for (let i = 0; i < oldTokens.length; i++){
    await BlacklistedToken.findByIdAndDelete(oldTokens[i]._id);
  }
  const timeTaken = Date.now() - oneDayAgo - 86400000;
  console.log(`Token blacklist was cleaned in ${timeTaken} ms.`);
}

module.exports = { cleanTokenBlacklist };