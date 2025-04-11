const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product'); // Schema for Product
const User = require('./models/User'); // Schema for User
const Cart = require('./models/Cart'); // Schema for Cart

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });

// User Registration
app.post('/api/users/register', async (req, res) => {
    const { username, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash: hashedPassword, phone, address });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

// User Login
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
    res.json({ token });
});

// Product Routes (Example for getting all products)
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
