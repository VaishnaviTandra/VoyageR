import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // make sure bootstrap is imported
import '../../../styles/Cities.css'

const citiesData = [
  { id: 1, name: 'Delhi', speciality: 'Capital city with rich history and culture', image: 'https://source.unsplash.com/400x300/?delhi' },
  { id: 2, name: 'Mumbai', speciality: 'City of dreams and Bollywood', image: 'https://source.unsplash.com/400x300/?mumbai' },
  { id: 3, name: 'Bengaluru', speciality: 'Silicon Valley of India', image: 'https://source.unsplash.com/400x300/?bengaluru' },
  { id: 4, name: 'Hyderabad', speciality: 'City of Pearls and Biryani', image: 'https://source.unsplash.com/400x300/?hyderabad' },
  { id: 5, name: 'Chennai', speciality: 'Cultural hub of South India', image: 'https://source.unsplash.com/400x300/?chennai' },
  { id: 6, name: 'Kolkata', speciality: 'City of Joy and Literature', image: 'https://source.unsplash.com/400x300/?kolkata' },
  { id: 7, name: 'Pune', speciality: 'Educational and cultural center', image: 'https://source.unsplash.com/400x300/?pune' },
  { id: 8, name: 'Ahmedabad', speciality: 'Industrial city and historical sites', image: 'https://source.unsplash.com/400x300/?ahmedabad' },
  { id: 9, name: 'Jaipur', speciality: 'The Pink City with forts and palaces', image: 'https://source.unsplash.com/400x300/?jaipur' },
  { id: 10, name: 'Lucknow', speciality: 'City of Nawabs and kebabs', image: 'https://source.unsplash.com/400x300/?lucknow' },
  { id: 11, name: 'Varanasi', speciality: 'Spiritual capital on the banks of Ganges', image: 'https://source.unsplash.com/400x300/?varanasi' },
  { id: 12, name: 'Goa', speciality: 'Beaches, parties, and churches', image: 'https://source.unsplash.com/400x300/?goa' },
  { id: 13, name: 'Amritsar', speciality: 'Golden Temple and Punjabi culture', image: 'https://source.unsplash.com/400x300/?amritsar' },
  { id: 14, name: 'Shimla', speciality: 'Queen of Hills', image: 'https://source.unsplash.com/400x300/?shimla' },
  { id: 15, name: 'Udaipur', speciality: 'City of Lakes and royal palaces', image: 'https://source.unsplash.com/400x300/?udaipur' },
];

function Cities() {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/cities/${id}`);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5 text-light">Explore Indian Cities</h1>
      <div className="row">
        {citiesData.map((city) => (
          <div key={city.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm glass-card">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{city.name}</h5>
                <p className="card-text">{city.speciality}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => handleClick(city.id)}
                >
                   Know More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cities;
