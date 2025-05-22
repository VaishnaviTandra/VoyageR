import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Guides.css';

function ViewguidesbyCity() {
  const location = useLocation();
  const navigate = useNavigate();
  const city = location.state?.city || 'All';

  const [guides, setGuides] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  async function getGuides() {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/guide-api/guide/bycity/${city}`);
console.log(res.data.payload)
      if (res.data.message === 'Guides available in city') {
        setGuides(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
        setGuides([]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch guides. Please try again later...');
      setGuides([]);
    } finally {
      setIsLoading(false);
    }
  }

  function gotoGuideProfile(guide) {
    navigate(`/guideprofile/${guide._id}`, { state: guide });
  }

  useEffect(() => {
    getGuides();
  }, [city]);

  return (
    <div className="container">
      <div>
        {error && <p className="text-danger display-4 text-center mt-5">{error}</p>}

        <h2 className="text-center my-4">Guides in {city}</h2>

        {isLoading ? (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading guides...</p>
          </div>
        ) : (
          <div className="row  row-cols-sm-2 row-cols-md-3 row-cols-lg-4 mb-3">
            {guides.length > 0 ? (
              guides.map((guide) =>
                guide.guides
                  .filter((g) => g.city === city)
                  .map((info, index) => (
                    <div className="col mb-3" key={`${guide._id}-${index}`}>
                      <div className="card glass-card custom-card-size">
                        <img
                          src={guide.profileImgUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                          className="card-img-top"
                          alt="Guide"
                        />
                        <div className="card-body text-warning">
  <h5 className="card-title fw-bold fs-5 mb-3 mt-3">
    {guide.firstName} {guide.lastName}
  </h5>
  <p className="card-text fw-semibold fs-6 mb-2">Email: {guide.email}</p>
  <p className="card-text fw-semibold fs-6 mb-2">Contact: {guide.contact}</p>
  <p className="card-text fw-semibold fs-6 mb-2">
    <strong>Languages:</strong> {info.languages.join(', ')}
  </p>
  <p className="card-text fw-semibold fs-6 mb-2">
    <strong>Availability:</strong> {info.availability.join(', ')}
  </p>
  <p className="card-text fw-semibold fs-6 mb-3">
    <strong>Price:</strong> ₹{info.price}
  </p>
  <button className="btn btn-info fw-bold">
    View Profile
  </button>
</div>

                      </div>
                    </div>
                  ))
              )
            ) : (
              <p className="col-12 text-center text-muted">No guides found for {city}.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewguidesbyCity;
