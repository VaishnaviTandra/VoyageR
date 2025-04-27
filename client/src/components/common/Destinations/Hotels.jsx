import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const location = useLocation();
  const city = location.state?.city || 'All'; // fallback if no city

  async function getHotels() {
    setIsLoading(true);
    const token = await getToken();
    try {
      const res = await axios.get(`http://localhost:3000/admin-api/admin/hotels1/${city}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'The hotels present are') {
        setHotels(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch hotels. Please try again later...');
    } finally {
      setIsLoading(false);
    }
  }

  function gotoHotelById(hotelObj) {
    navigate(`/hotelbyid/${hotelObj._id}`, { state: hotelObj });
  }

  useEffect(() => {
    getHotels();
  }, [city]); // re-fetch when city changes

  // 👇 helper function to get image URL
  function getHotelImage(hotelObj) {
    const firstImage = hotelObj.images?.[0];
    console.log(firstImage)
    if (!firstImage) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }

    // if it looks like a photo_reference (not URL)
    if (!firstImage.startsWith('http') && firstImage.length < 200) {
      return `http://localhost:3000/admin-api/admin/hotels/photo?ref=${firstImage}`;
    }

    // else it's already a full URL
    return firstImage;
  }

  return (
    <div className="container">
      <div>
        {error && <p className="text-danger display-4 text-center mt-5">{error}</p>}

        <h2 className="text-center my-4">Hotels in {city}</h2>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading hotels...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-3">
            {hotels.map((hotelObj, idx) => (
              <div className="col mb-3" key={idx}>
                <div className="card h-100">
                  <div className="card-body text-center">
                    <img
                      src={getHotelImage(hotelObj)}
                      alt="Hotel"
                      className="img-fluid mb-2"
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    <h5 className="mt-2">{hotelObj.nameOfHotel}</h5>
                    <p>
                      Rating - {hotelObj.rating ?? 'N/A'}{' '}
                      {hotelObj.rating ? '⭐'.repeat(Math.round(hotelObj.rating)) : '🤷‍♂️'}
                    </p>
                    <button className="btn btn-info mt-2" onClick={() => gotoHotelById(hotelObj)}>
                      View Details...
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;
