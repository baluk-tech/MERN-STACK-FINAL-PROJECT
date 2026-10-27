const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;
require('dotenv').config();

require('./config/db.js');
app.use(cors());
app.use(express.json());

app.use("/uploads",express.static("uploads/"))

const authRoutes = require('./routes/authRoutes.js');
app.use('/api/auth', authRoutes);

const mailRoutes = require('./routes/mailRoutes.js');
app.use('/api/mail', mailRoutes);

const adminRoutes = require('./routes/adminRoutes.js');
app.use('/api/admin', adminRoutes);

const userRoutes = require('./routes/userRoutes.js');
app.use('/api/user', userRoutes);

const productRoutes = require('./routes/productRoutes.js');
app.use('/api/products', productRoutes);

const orderRoutes = require('./routes/orderRoutes.js');
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})