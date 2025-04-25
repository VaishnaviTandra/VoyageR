import React, { useState } from 'react';
import axios from 'axios';

function PostDestination() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
    { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 }
  ];

  const handleFetchandPost = async () => {
    setIsLoading(true);
    setMessage('Fetching from Google (via backend) and posting to database...');

    try {
      let allDestinations = [];

      for (const city of cities) {
        const res = await axios.get("http://localhost:3000/admin-api/admin/google-places", {
          params: {
            lat: city.lat,
            lng: city.lng
          }
        });

        const results = res.data.payload.results;

        const cityDestinations = results.map(place => ({
          nameOfDestination: place.name,
          description: place.vicinity || `Popular tourist place in ${city.name}`,
          location: `${place.geometry.location.lat},${place.geometry.location.lng}`,
          images: place.photos
            ? place.photos.slice(0, 6).map(p =>
                `http://localhost:3000/admin-api/admin/photo?ref=${p.photo_reference}`
              )
            : ["https://via.placeholder.com/800x600?text=No+Image+Available"],
          popularActivities: ["Sightseeing", "Photography"],
          rating: place.rating || 0,
          city: city.name
        }));

        allDestinations = [...allDestinations, ...cityDestinations];
        setMessage(prev => `${prev}\n✅ Fetched ${cityDestinations.length} destinations for ${city.name}`);
      }

      if (allDestinations.length > 0) {
        await axios.post("http://localhost:3000/admin-api/admin/destinations", allDestinations);
        setMessage(prev => `${prev}\n✅ Successfully posted ${allDestinations.length} destinations to the database!`);
      } else {
        setMessage(prev => `${prev}\n⚠️ No destinations found to post.`);
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
      <h1 className="text-2xl font-bold mb-4">Destination Data Management</h1>

      <div className="mb-6">
        <button
          onClick={handleFetchandPost}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 "
          }`}
        >
          {isLoading ? "Processing..." : "Fetch & Post Destinations"}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <pre className="whitespace-pre-wrap">{message}</pre>
        </div>
      )}
    </div>
  );
}

export default PostDestination;
