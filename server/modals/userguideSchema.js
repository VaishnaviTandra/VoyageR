const mongoose = require('mongoose');

const guideinfo = new mongoose.Schema({
  languages: {
    type: [String],
    required: true
  },
  availability: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  city: {
    type: String,
    required: true
  }
}, { strict: "throw" });

const userguideSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number
  },
  profileImgUrl: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  guides: {
    type: [guideinfo]
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'active'
  },
  firstName: String,
  lastName: String
}, { strict: "throw" });

const UserGuide = mongoose.model('userguide', userguideSchema);
module.exports = UserGuide;
