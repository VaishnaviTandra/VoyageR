import React, { useState } from 'react';
import axios from 'axios';

function PostHotel() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi', pincode: 110001 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', pincode: 400001 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka', pincode: 560001 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana', pincode: 500001 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', pincode: 600001 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal', pincode: 700001 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', pincode: 411001 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat', pincode: 380001 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', pincode: 302001 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', pincode: 226001 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739, state: 'Uttar Pradesh', pincode: 221001 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240, state: 'Goa', pincode: 403001 },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723, state: 'Punjab', pincode: 143001 },
    { name: 'Shimla', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh', pincode: 171001 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125, state: 'Rajasthan', pincode: 313001 }
  ];

  const handleFetchAndPostHotels = async () => {
    setIsLoading(true);
    setMessage('Fetching hotels from Google and posting to database...');

    try {
      let allHotels = [];

      for (const city of cities) {
        const res = await axios.get("http://localhost:3000/admin-api/admin/hotel/google-places", {
          params: {
            lat: city.lat,
            lng: city.lng
          }
        });

        const results = res.data.payload.results;
        console.log(results);
        const cityHotels = results.map(place => ({
          nameOfHotel: place.name,
          address: {
            state: city.state,
            city: city.name,
            landmark: place.vicinity || place.name,
            pincode: city.pincode
          },
          costperDay: Math.floor(Math.random() * (15000 - 3000)) + 3000, // Random price
          availableRooms: Math.floor(Math.random() * (50 - 10)) + 10, // Random 10-50 rooms
          images: place.photos
            ? place.photos.slice(0, 5).map(p =>
                `http://localhost:3000/admin-api/admin/hotels/photo?ref=${p.photo_reference}`
              )
            : ["https://via.placeholder.com/800x600?text=No+Image+Available"],
          luxuries: ["Free WiFi", "Swimming Pool", "Gym"], // Example luxuries
          rating: place.rating || 0,
          bookings: [] // No bookings yet
        }));

        allHotels = [...allHotels, ...cityHotels];
        setMessage(prev => `${prev}\n✅ Fetched ${cityHotels.length} hotels for ${city.name}`);
      }

      if (allHotels.length > 0) {
        await axios.post("http://localhost:3000/admin-api/admin/hotels", allHotels);
        setMessage(prev => `${prev}\n✅ Successfully posted ${allHotels.length} hotels to the database!`);
      } else {
        setMessage(prev => `${prev}\n⚠️ No hotels found to post.`);
      }

    } catch (error) {
      console.error("Error details:", error);
      setMessage(prev => `${prev}\n❌ Error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hotel Data Management</h1>

      <div className="mb-6">
        <button
          onClick={handleFetchAndPostHotels}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 "
          }`}
        >
          {isLoading ? "Processing..." : "Fetch & Post Hotels"}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2 text-light">Status:</h2>
          <pre className="whitespace-pre-wrap text-light">{message}</pre>
        </div>
      )}
    </div>
  );
}

export default PostHotel;
