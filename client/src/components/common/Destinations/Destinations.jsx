import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const location = useLocation();
  const city = location.state?.city || 'All';

  useEffect(() => {
    getDestinations();
  }, [city]);

  async function getDestinations() {
    setIsLoading(true);
    const token = await getToken();
    try {
      const res = await axios.get(`http://localhost:3000/admin-api/admin/destinations/${city}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'The destinations present are') {
        setDestinations(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
        setDestinations([]);
      }
    } catch (err) {
      setError('Failed to fetch destinations. Please try again later...');
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  }

  function gotoDestinationById(destinationObj) {
    navigate(`/destinationbyid/${destinationObj._id}`, { state: destinationObj });
  }


function getDestinationImage(destinationObj) {
  const firstImage = destinationObj.images?.[0];
  console.log(firstImage);

  if (!firstImage) {
    return 'https://via.placeholder.com/300x200?text=No+Image';
  }

   if (!firstImage.startsWith('http') && firstImage.length < 200) {
      return `http://localhost:3000/admin-api/admin/destination/photo?ref=${firstImage}`;
    }


  return firstImage;
}

  return (
    <div className="container">
      <div>
        {error && <p className="text-danger display-4 text-center mt-5">{error}</p>}

        <h2 className="text-center my-4 text-light">Destinations in {city}</h2>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading destinations...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-3">
            {destinations.map((destinationObj, idx) => (
              <div className="col mb-3" key={idx}>
  <div className="card glass-card h-100 d-flex flex-column">
    <img
      src={getDestinationImage(destinationObj)}
      alt="Destination"
      className="img-fluid"
      style={{ height: '200px', objectFit: 'cover' }}
    />
    <div className="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 className="mt-2">{destinationObj.nameOfDestination}</h5>
        <p>{destinationObj.description}</p>
      </div>
      <div className="mt-auto text-center">
        <p className="mb-2">
          Rating - {destinationObj.rating ?? 'N/A'}{' '}
          {destinationObj.rating ? '⭐'.repeat(Math.round(destinationObj.rating)) : '🤷‍♂️'}
        </p>
        <button
          className="btn btn-info"
          onClick={() => gotoDestinationById(destinationObj)}
        >
          View Details
        </button>
      </div>
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

export default Destinations;
