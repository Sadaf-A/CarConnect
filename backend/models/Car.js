const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    carNumber: { type: String, required: true },
    year: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    imageUrls : [{ type: String, required: true }],
    user: { type: String, required: true }
  },
  { timestamps: true } 
);

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
