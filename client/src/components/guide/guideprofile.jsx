import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cities = [
  { name: 'Delhi' },
  { name: 'Mumbai' },
  { name: 'Bengaluru' },
  { name: 'Hyderabad' },
  { name: 'Chennai' },
  { name: 'Kolkata' },
  { name: 'Pune' },
  { name: 'Ahmedabad' },
  { name: 'Jaipur' },
  { name: 'Lucknow' },
  { name: 'Varanasi' },
  { name: 'Goa' },
  { name: 'Amritsar' },
  { name: 'Shimla' },
  { name: 'Udaipur' }
];

function GuideProfile() {
  const [languages, setLanguages] = useState(['English', 'Hindi', 'Punjabi', 'Telugu','Marathi','Gujarathi','Kannada','Tamil']);
  const [availability, setAvailability] = useState([]);
  const [city, setCity] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    languages: [],
    availability: [],
    price: '',
    destination: '',
    city: '',
  });

  useEffect(() => {
    if (city) {
      axios.get(`/api/destinations?city=${city}`).then((response) => {
        setDestinations(response.data);
      });
    }
  }, [city]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        languages: [...formData.languages, value],
      });
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter((lang) => lang !== value),
      });
    }
  };

  const handleAvailabilityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAvailability([...availability, value]);
    } else {
      setAvailability(availability.filter((time) => time !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/guide-api/guides', formData);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Guide Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Languages */}
        <div className="form-group">
          <label>Languages</label>
          <div>
            {languages.map((lang) => (
              <div className="form-check" key={lang}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={lang}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label">{lang}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="form-group">
          <label>Availability</label>
          <div>
            {['8am-9am', '9am-10am', '10am-11am', '11am-12pm', '12pm-1pm', '1pm-2pm', '2pm-3pm', '3pm-4pm', '4pm-5pm', '5pm-6pm', '6pm-7pm', '7pm-8pm'].map((time) => (
              <div className="form-check" key={time}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={time}
                  onChange={handleAvailabilityChange}
                />
                <label className="form-check-label">{time}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <select
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map((cityOption) => (
              <option key={cityOption.name} value={cityOption.name}>
                {cityOption.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination */}
        <div className="form-group">
          <label>Destination</label>
          <select
            className="form-control"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
          >
            <option value="">Select a destination</option>
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
}

export default GuideProfile;
