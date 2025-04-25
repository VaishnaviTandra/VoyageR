const exp=require('express')
const destinationApp=exp.Router()
const Destination = require('../modals/destination');
const UserGuide = require('../modals/userguideSchema');
const expressAsyncHandler = require('express-async-handler');
const axios = require('axios');
destinationApp.get('/destinations/:category', expressAsyncHandler(async (req, res) => {
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
  adminApp.get('/admin/photo', expressAsyncHandler(async (req, res) => {
    const ref = req.query.ref;
    if (!ref) return res.status(400).send("Missing photo reference");
  
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${ref}&key=${process.env.GOOGLE_API_KEY}`;
    
    res.redirect(photoUrl);
  }));
  destinationApp.get()