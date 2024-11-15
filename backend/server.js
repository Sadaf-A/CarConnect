const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
dotenv.config();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',  // Swagger version
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Node.js application',
    },
  },
  apis: ['./routes/*.js'], // Path to your API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
