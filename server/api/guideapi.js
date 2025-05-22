const exp = require('express');
const guideApp = exp.Router();
const Guide = require('../modals/userguideSchema'); // same schema, filtering by role
const expressAsyncHandler = require('express-async-handler');

// Get all guides
guideApp.get('/guides', expressAsyncHandler(async (req, res) => {
    const guides = await Guide.find({ role: 'guide' });
    res.status(200).send({ message: "Guides Retrieved", payload: guides });
}));

// Get guides by destination
guideApp.get('/guide/bycity/:city', expressAsyncHandler(async (req, res) => {
  const { city } = req.params;

  let allGuides;

  if (city === 'All') {
    // Get all guides with role 'guide'
    allGuides = await UserGuide.find({ role: 'guide' });
  } else {
    // Get all guides, then filter manually for those that have at least one guide entry with matching city
    const allGuideDocs = await Guide.find({ role: 'guide' });

    allGuides = allGuideDocs.filter(user =>
      user.guides.some(g => g.city.toLowerCase() === city.toLowerCase())
    );
  }
  console.log(allGuides)

  res.status(200).send({
    message: 'Guides available in city',
    payload: allGuides
  });
}));


guideApp.post('/guides', expressAsyncHandler(async (req, res) => {
  const guideData = req.body;

  

  // Check if a guide with the same email already exists
  const existingGuide = await Guide.findOne({ email: guideData.email });
  if (existingGuide) {
    return res.status(409).send({ message: "Guide already exists" });
  }

  // Ensure the role is 'guide'
  if (guideData.role !== 'guide') {
    return res.status(400).send({ message: "Invalid role. Only 'guide' allowed here." });
  }

  // Prepare guide info (optional)
  const guideInfo = guideData.guides;

  // Create a new guide document
  const newGuide = new Guide({
      username: guideData.username,
      email: guideData.email,
      contact: guideData.contact,
      profileImgUrl: guideData.profileImgUrl,
      role: guideData.role,
      guides: guideInfo, // Assign the guides array
      wishlist: guideData.wishlist || [], // Optional
      firstName: guideData.firstName,
      lastName: guideData.lastName,
      isBlocked: guideData.isBlocked || false,
      status: guideData.status || 'active'
  });

  // Save the guide document
  const savedGuide = await newGuide.save();
  res.status(201).send({ message: "Guide created", payload: savedGuide });
}));

guideApp.get('/guides/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const guide = await Guide.findOne({ email });

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    res.send({message:"Fetched guide by id",payload:guide});
  } catch (error) {
    console.error('Error fetching guide by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update guide details
guideApp.put('/guides/:id', expressAsyncHandler(async (req, res) => {
  const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,   // <<<--- Corrected here
      { $set: req.body },
      { returnOriginal: false }
  );

  if (!updatedGuide) return res.status(404).send({ message: "Guide not found" });

  res.send({ message: "Guide updated successfully!", payload: updatedGuide });
}));


module.exports = guideApp;
