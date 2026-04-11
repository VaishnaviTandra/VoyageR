const exp = require('express');
const userApp = exp.Router();
const User = require('../modals/userguideSchema'); // same schema, filtering by role
const Hotel=require('../modals/hotelsschema')
const expressAsyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
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
userApp.get('/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User exists', payload: existingUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }});
 userApp.put('/user/book-hotel/:id', async (req, res) => {
  try {
    const hotelId = req.params.id;
    const booking = req.body;

    // ✅ Payment check
    if (booking.paymentStatus === "paid" && !booking.paymentId) {
      return res.status(400).json({ message: "Payment not verified" });
    }

    // ✅ Get hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // ✅ Save booking
    hotel.bookings.push(booking);
    await hotel.save();

    // ✅ Get user details (IMPORTANT)
    const userData = await User.findById(booking.user);

    // ✅ Send Email
    await sendEmail(
      userData.email,
      "VoyageR Booking Confirmation 🎉",
      `
      <h2>Booking Confirmed!</h2>
      <p><b>Hotel:</b> ${hotel.nameOfHotel}</p>
      <p><b>Location:</b> ${hotel.address.city}</p>
      <p><b>Check-in:</b> ${booking.checkIn}</p>
      <p><b>Check-out:</b> ${booking.checkOut}</p>
      <p><b>Total Price:</b> ₹${booking.totalPrice}</p>
      <p><b>Payment Status:</b> ${booking.paymentStatus}</p>
      <br/>
      <p>Thank you for choosing VoyageR ✈️</p>
      `
    );

    res.status(200).json({ 
      message: "Booking added & email sent ✅", 
      hotel 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking", error: err.message });
  }
});
module.exports = userApp;
