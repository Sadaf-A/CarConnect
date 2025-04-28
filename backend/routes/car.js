const express = require('express');
const Car = require('../models/Car');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { uploadFile } = require('../gcp/imageUploadService');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};


 /**
 * @swagger
 * /api/cars/get-car/{id}:
 *   get:
 *     summary: Get a specific car by ID
 *     description: Fetch details of a specific car by its ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the car to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 carNumber:
 *                   type: string
 *                 year:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 description:
 *                   type: string
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal Server Error
 */ 
router.get('/get-car/:id', authenticateUser, async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching car details' });
    }
});

/**
 * @swagger
 * /api/cars/delete-car/{id}:
 *   delete:
 *     summary: Delete a car
 *     description: Remove a car from the system using its ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the car to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete-car/:id', authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;  // Get car ID from the URL
  
      const car = await Car.findById(id);
  
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // Delete the car
      await car.deleteOne({ _id : id });
      res.status(200).json({ message: 'Car deleted successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  /**
 * @swagger
 * /api/cars/update-car/{id}:
 *   put:
 *     summary: Update car details
 *     description: Modify an existing car's details
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the car to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               carNumber:
 *                 type: string
 *               year:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal Server Error
 */
  router.put('/update-car/:id', authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;  // Get car ID from the URL
      const { title, description, year, price, imageUrls } = req.body;  // Get updated car details from the body
  
      // Find the car by ID and update it
      const car = await Car.findById(id);
  
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      // You can update any fields as necessary
      car.title = title || car.title;
      car.description = description || car.description;
      car.year = year || car.year;
      car.price = price || car.price;
      car.imageUrls = imageUrls || car.imageUrls;  // Update images if provided
  
      await car.save();  // Save the updated car in the database
      res.status(200).json({ message: 'Car updated successfully', car });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
/**
 * @swagger
 * /api/cars/get-cars:
 *   get:
 *     summary: Get all cars
 *     description: Fetch all cars available in the database
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of all cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: The car's title
 *                   carNumber:
 *                     type: string
 *                     description: The car's unique identifier
 *                   year:
 *                     type: string
 *                     description: The year of manufacture
 *                   price:
 *                     type: number
 *                     format: float
 *                     description: The price of the car
 *                   description:
 *                     type: string
 *                     description: The car's description
 *       500:
 *         description: Internal Server Error
 */
router.get('/get-cars', authenticateUser, async (req, res) => {
    try {
      const cars = await Car.find({ user: req.user.user.id });
      console.log(cars)
      res.json(cars);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  
 /**
 * @swagger
 * /api/cars/create-car:
 *   post:
 *     summary: Create a new car
 *     description: Create a new car listing in the system
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The car's title
 *               carNumber:
 *                 type: string
 *                 description: The car's unique number
 *               year:
 *                 type: string
 *                 description: The car's manufacturing year
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The car's price
 *               description:
 *                 type: string
 *                 description: A brief description of the car
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Image URLs of the car
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.post('/add-car', authenticateUser, upload.array('images', 5), async (req, res) => {
  try {
    const { title, carNumber, year, price, description } = req.body;
    console.log(req.body);
    const files = req.files; 
    console.log(files)
    if (!files || files.length === 0) {
      return res.status(400).send('No image files uploaded.');
    }

    const imageUrls = [];
    for (const file of files) {
      const tempFilePath = file.path;
      const destFileName = path.basename(file.originalname);

      await uploadFile(tempFilePath, destFileName);

      fs.unlinkSync(tempFilePath);

      imageUrls.push(`https://storage.googleapis.com/car-connect123/${destFileName}`);
    }
    
    const newCar = new Car({
      title,
      carNumber,
      year,
      price,
      description,
      imageUrls, 
      user : req.user.user.id
    });

    await newCar.save();

    res.status(201).send({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).send('Failed to add car.');
  }
});

module.exports = router;
