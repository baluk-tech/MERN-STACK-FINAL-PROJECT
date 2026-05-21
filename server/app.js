const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
require('dotenv').config();

require('./config/db.js');
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes.js');
app.use('/api/auth', authRoutes);

const mailRoutes = require('./routes/mailRoutes.js');
app.use('/api/mail', mailRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})