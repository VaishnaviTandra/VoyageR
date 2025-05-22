const exp = require('express');
const adminApp = exp.Router();
const Hotels = require('../modals/hotelsschema');
const Destination = require('../modals/destination');
const UserGuide = require('../modals/userguideSchema');
const expressAsyncHandler = require('express-async-handler');
const axios = require('axios');


// ========== HOTELS ==========

// Get all hotels
adminApp.get('/admin/hotels', expressAsyncHandler(async (req, res) => {
    const hotels = await Hotels.find({});
    res.status(200).send({ message: "Hotels retrieved successfully", payload: hotels });
}));

// Get hotel by ID
adminApp.get('/admin/hotels1/:city', expressAsyncHandler(async (req, res) => {
  const { city } = req.params;

  let hotels;

  if (city === 'All') {
    hotels = await Hotels.find({});
  } else {
    hotels = await Hotels.find({ 'address.city': city }); // 👈 important fix
  }

  if (hotels.length > 0) {
    res.status(200).send({ message: "The hotels present are", payload: hotels });
  } else {
    res.status(200).send({ message: "The hotels present are", payload: [] }); // safer
  }
}));



// Add hotel
adminApp.post('/admin/hotels', expressAsyncHandler(async (req, res) => {
    try {
        const data = req.body;

        // Check if it's an array of hotels
        if (Array.isArray(data)) {
            const insertedHotels = await Hotels.insertMany(data);
            res.status(201).send({ message: "Hotels added successfully", payload: insertedHotels });
        } else {
            const newHotel = new Hotels(data);
            await newHotel.save();
            res.status(201).send({ message: "Hotel added successfully", payload: newHotel });
        }
    } catch (error) {
        res.status(500).send({ message: "Error adding hotel(s)", error: error.message });
    }
}));


// Update hotel
adminApp.put('/admin/hotels/:id', expressAsyncHandler(async (req, res) => {
    const updated = await Hotels.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).send({ message: "Hotel not found" });
    res.send({ message: "Hotel updated successfully", payload: updated });
}));

// Delete hotel
adminApp.delete('/admin/hotels/:id', expressAsyncHandler(async (req, res) => {
    const deleted = await Hotels.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "Hotel not found" });
    res.send({ message: "Hotel deleted successfully", payload: deleted });
}));


// ========== DESTINATIONS ==========

// Get all destinations
adminApp.get('/admin/destinations/:category', expressAsyncHandler(async (req, res) => {
    const { category } = req.params;
  
    let destinations;
  
    if (category === 'All') {
      destinations = await Destination.find({});
    } else {
      destinations = await Destination.find({ city: category });
    }
  
    if (destinations.length > 0) {
      res.status(200).send({ message: "The destinations present are", payload: destinations });
    } else {
      res.status(200).send({ message: "No destinations found for the selected category" });
    }
  }));
// backend route

adminApp.get('/admin/destination/photo', expressAsyncHandler(async (req, res) => {
  const ref = req.query.ref;
  if (!ref) return res.status(400).send("Missing photo reference");

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`;
  
  res.redirect(photoUrl);
}));


// Get destination by ID
adminApp.get('/admin/destination/:id', expressAsyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) return res.status(404).send({ message: "Destination not found" });
  res.send({ message: "Destination found", payload: destination });
}));

adminApp.get('/admin/hotels3/:id', expressAsyncHandler(async (req, res) => {
  const hotel = await Hotels.findById(req.params.id);
  if (!hotel) {
    return res.status(404).send({ message: "Hotel not found" });
  }
  res.send({ message: "Hotel found", payload: hotel });
}));

adminApp.post('/admin/destinations', expressAsyncHandler(async (req, res) => {
    console.log("🔥 Received destination data:", req.body.length);
  
    try {
      const data = req.body;
  
      if (Array.isArray(data)) {
        const existingNames = await Destination.find({
          nameOfDestination: { $in: data.map(d => d.nameOfDestination) }
        }).distinct('nameOfDestination');
  
        const filtered = data.filter(
          d => !existingNames.includes(d.nameOfDestination)
        );
  
        if (filtered.length === 0) {
          return res.status(200).send({ message: "All destinations already exist, nothing to add." });
        }
  
        const inserted = await Destination.insertMany(filtered);
        res.status(201).send({
          message: `✅ Added ${inserted.length} new destinations. Skipped ${data.length - inserted.length} duplicates.`,
          payload: inserted
        });
      } else {
        const exists = await Destination.findOne({ nameOfDestination: data.nameOfDestination });
        if (exists) {
          return res.status(409).send({ message: "❌ Duplicate destination" });
        }
        const newDest = new Destination(data);
        await newDest.save();
        res.status(201).send({ message: "✅ Destination added successfully", payload: newDest });
      }
    } catch (error) {
      console.error("❌ Error adding destination(s):", error.message);
      res.status(500).send({ message: "Server Error", error: error.message });
    }
  }));
// Update destination
adminApp.put('/admin/destinations/:id', expressAsyncHandler(async (req, res) => {
    const updated = await Destination.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).send({ message: "Destination not found" });
    res.send({ message: "Destination updated successfully", payload: updated });
}));

// Delete destination
adminApp.delete('/admin/destinations/:id', expressAsyncHandler(async (req, res) => {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "Destination not found" });
    res.send({ message: "Destination deleted successfully", payload: deleted });
}));


// ========== USER GUIDES (VIEW ONLY) ==========

// Get all user guides
adminApp.get('/admin/userguides', expressAsyncHandler(async (req, res) => {
    const guides = await UserGuide.find({});
    res.status(200).send({ message: "User guides retrieved successfully", payload: guides });
}));


adminApp.get('/admin/google-places', expressAsyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!lat || !lng) {
        return res.status(400).send({ message: "Latitude and longitude are required" });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=tourist_attraction&key=${API_KEY}`;
        const response = await axios.get(url);
        res.status(200).send({ message: "Places fetched successfully", payload: response.data });
    } catch (error) {
        console.error("Google API error:", error.message);
        res.status(500).send({ message: "Failed to fetch from Google API", error: error.message });
    }
}));
adminApp.get('/admin/hotel/google-places', expressAsyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  const API_KEY = process.env.GOOGLE_API_KEY;
  console.log(API_KEY)

  if (!lat || !lng) {
      return res.status(400).send({ message: "Latitude and longitude are required" });
  }

  try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=lodging&key=${API_KEY}`;
      const response = await axios.get(url);
      res.status(200).send({ message: "Hotels fetched successfully", payload: response.data });
  } catch (error) {
      console.error("Google API error:", error.message);
      res.status(500).send({ message: "Failed to fetch from Google API", error: error.message });
  }
}));
adminApp.get('/admin/hotels/photo', expressAsyncHandler(async (req, res) => {
  const ref = req.query.ref;
  if (!ref) return res.status(400).send("Missing photo reference");

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`;
  
  res.redirect(photoUrl);
}));


module.exports = adminApp;
