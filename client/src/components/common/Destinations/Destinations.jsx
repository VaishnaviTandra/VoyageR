// Final: Destinations.js (Frontend Component)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [categories] = useState([
    'All', 'Delhi', 'Mumbai', 'Benguluru', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Varanasi',
    'Goa', 'Amritsar', 'Shimla', 'Udaipur'
  ]);
  const [selectCat, setSelectCat] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  async function getDestinations() {
    setIsLoading(true);
    const token = await getToken();
    try {
      let res = await axios.get(`http://localhost:3000/admin-api/admin/destinations/${selectCat}`
, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.message === 'The destinations present are') {
        setDestinations(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch destinations. Please try again later...');
    } finally {
      setIsLoading(false);
    }
  }

  function gotoDestinationById(destinationObj) {
    navigate(`/destinationbyid/${destinationObj._id}`, { state: destinationObj });

  }

  useEffect(() => {
    getDestinations();
  }, [selectCat]);

  return (
    <div className="container">
      <div>
        {error && <p className="text-danger display-4 text-center mt-5">{error}</p>}

        <div className="mb-4 mt-0 d-flex">
          <label className="form-label text-white text-end me-3 lead fs-5">Filter by category:</label>
          <select className="form-select w-50" value={selectCat} onChange={(e) => setSelectCat(e.target.value)}>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading destinations...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-3">
            {destinations.map((destinationObj, idx) => (
              <div className="col mb-3" key={idx}>
                <div className="card h-100">
                  <div className="card-body">
                    <img
                      src={destinationObj.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt="Destination"
                      className="img-fluid mb-2"
                    />
                    <h5>{destinationObj.nameOfDestination}</h5>
                    <p>{destinationObj.description}</p>
                    <p>{destinationObj.location}</p>
                    <p>
                      Rating - {destinationObj.rating ?? 'N/A'}{' '}
                      {destinationObj.rating ? '⭐'.repeat(Math.round(destinationObj.rating)) : '🤷‍♂️'}
                    </p>
                    <button className="btn btn-info" onClick={() => gotoDestinationById(destinationObj)}>
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

export default Destinations;
