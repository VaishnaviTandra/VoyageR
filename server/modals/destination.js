const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  nameOfDestination: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  popularActivities: {
    type: [String],
    required: true
  },
  vrLink: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  city: {
    type: String, // 👈 Add this field
    required: true
  }
}, {"strict":"throw"});

const DestinationModel = mongoose.model('Destination', destinationSchema);
module.exports = DestinationModel;
