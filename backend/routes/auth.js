const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account
 *     tags: Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Create a new user (store password as plain text)
      user = new User({ name, email, password });
      console.log(user)
      // Save user to the database
      await user.save();
  
      // Send success response
      res.status(201).json({ msg: 'User registered successfully', user: { name, email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  /**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate the user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = bcrypt.compareSync(password, user.password);

      // Compare the entered password with the stored plaintext password
      if (!isMatch) {
        console.log(user.password, password)
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Generate JWT token (for authenticated users)
      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(token)
      res.json({ token, msg: 'Login successful', user: { name: user.name, email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  

module.exports = router;
