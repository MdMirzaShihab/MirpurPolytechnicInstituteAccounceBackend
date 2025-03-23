const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Import routes
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const reportRoutes = require('./routes/reportRoutes');
const todayTransactionRoutes = require('./routes/todayTransactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const seedRoutes = require('./routes/seedRoutes');

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors()); 
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/payment-methods', paymentMethodRoutes);
app.use('/reports', reportRoutes);
app.use('/today-reports', todayTransactionRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/seed', seedRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;