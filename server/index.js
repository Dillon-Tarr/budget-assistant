const connectDB = require('./startup/db');
const cors = require('cors');
const express = require('express');
const app = express();

const users = require('./routes/users');
const auth = require('./routes/auth');
const budgets = require('./routes/budgets');
const blacklistedTokens = require('./routes/blacklistedTokens');

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/api/users', users);
app.use('/api/budgets', budgets);
app.use('/api/blacklisted-tokens', blacklistedTokens);
app.use('/api/auth', auth);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
