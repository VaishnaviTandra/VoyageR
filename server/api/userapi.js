const exp = require('express');
const userApp = exp.Router();
const User = require('../modals/userguideSchema'); // same schema, filtering by role
const Hotel=require('../modals/hotelsschema')
const expressAsyncHandler = require('express-async-handler');

// Get all users (role: user)
userApp.get('/users', expressAsyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' });
    res.status(200).send({ message: "Users Retrieved", payload: users });
}));

// Register new user
userApp.post('/users', expressAsyncHandler(async (req, res) => {
    const userData = req.body;
    const existingUser = await User.findOne({ email: userData.email });

    if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
    }

    if (userData.role !== 'traveler') {
        return res.status(400).send({ message: "Invalid role. Only 'user' allowed here." });
    }
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    console.log(savedUser)
    res.status(201).send({ message: "traveler", payload: savedUser });
}));
//Get all bookings of a user 
userApp.get('/user-bookings/:userId',async(req,res)=>{
    try{
        const userId=req.params.userId;
        const hotels = await Hotel.find({ "bookings.user": userId });

    const userBookings = hotels.flatMap(hotel =>
      hotel.bookings
        .filter(booking => booking.user.toString() === userId)
        .map(booking => ({
          hotelName: hotel.nameOfHotel,
          location: hotel.address.city,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          totalPrice: booking.totalPrice,
          paymentStatus: booking.paymentStatus,
        }))
    );

    res.status(200).json({ bookings: userBookings });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
})
// PUT /block-status/:id
userApp.put('/block-status/:id', expressAsyncHandler(async (req, res) => {
  const { isBlocked } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { isBlocked },
    { new: true }
  );

  if (!updated) {
    return res.status(404).send({ message: 'User/Guide not found' });
  }

  res.status(200).send({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, payload: updated });
}));

module.exports = userApp;
