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
guideApp.get('/guides/destination/:destinationId', expressAsyncHandler(async (req, res) => {
    const guides = await Guide.find({ destination: req.params.destinationId, role: 'guide' });
    res.status(200).send({ message: "Guides Retrieved", payload: guides });
}));

// Register new guide
guideApp.post('/guides', expressAsyncHandler(async (req, res) => {
    const guideData = req.body;
    const existingGuide = await Guide.findOne({ email: guideData.email });

    if (existingGuide) {
        return res.status(409).send({ message: "Guide already exists" });
    }

    if (guideData.role !== 'guide') {
        return res.status(400).send({ message: "Invalid role. Only 'guide' allowed here." });
    }

    const newGuide = new Guide(guideData);
    const savedGuide = await newGuide.save();
    res.status(201).send({ message: "guide", payload: savedGuide });
}));

// Update guide details
guideApp.put('/guides/:guideId', expressAsyncHandler(async (req, res) => {
    const updatedGuide = await Guide.findByIdAndUpdate(
        req.params.guideId,
        { $set: req.body },
        { returnOriginal: false }
    );

    if (!updatedGuide) return res.status(404).send({ message: "Guide not found" });

    res.send({ message: "Guide updated successfully!", payload: updatedGuide });
}));

module.exports = guideApp;
