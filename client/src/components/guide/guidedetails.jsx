import React, { useState, useEffect } from 'react';
import axios from 'axios';

function guidedetails() {
  const [guideData, setGuideData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const languageOptions = ['English', 'Hindi', 'Punjabi', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Tamil'];
  const availabilityOptions = ['8am-9pm', '9am-10pm', '10am-11pm'];
  const cityOptions = ['Delhi', 'Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Varanasi', 'Goa', 'Amritsar', 'Shimla', 'Udaipur'];

  const [formData, setFormData] = useState({
    contact: '',
    languages: [],
    availability: [],
    price: '',
    city: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      axios.get(`http://localhost:3000/guide-api/guides/${storedUser.email}`)
        .then((res) => {
          const data = res.data.payload;
          setGuideData(data);

          const guideInfo = data?.guides?.[0] || {};
          setFormData({
            contact: data.contact || '',
            languages: guideInfo.languages || [],
            availability: guideInfo.availability || [],
            price: guideInfo.price || '',
            city: guideInfo.city || ''
          });
        })
        .catch((err) => console.error('Failed to fetch guide data:', err));
    }
  }, []);

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      contact: parseInt(formData.contact),
      guides: [{
        languages: formData.languages,
        availability: formData.availability,
        price: parseInt(formData.price),
        city: formData.city
      }]
    };

    try {
      await axios.put(`http://localhost:3000/guide-api/guides/${guideData._id}`, payload);
      alert('Guide details updated successfully!');
      setEditMode(false);

      // Refresh after update
      setGuideData((prev) => ({
        ...prev,
        contact: payload.contact,
        guides: [{
          ...payload.guides[0]
        }]
      }));
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  };

  if (!guideData || !guideData.guides || guideData.guides.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Guide Details</h2>

        {!editMode ? (
          <>
            <p><strong>Username:</strong> {guideData.username}</p>
            <p><strong>Email:</strong> {guideData.email}</p>
            <p><strong>Contact:</strong> {guideData.contact}</p>
            <p><strong>City:</strong> {guideData.guides[0].city}</p>
            <p><strong>Price:</strong> ₹{guideData.guides[0].price}</p>
            <p><strong>Languages:</strong> {guideData.guides[0].languages.join(', ')}</p>
            <p><strong>Availability:</strong> {guideData.guides[0].availability.join(', ')}</p>

            <button className="btn btn-warning mt-3" onClick={() => setEditMode(true)}>
              Update Details
            </button>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="mt-4 border-top pt-4">
            {/* Contact */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Contact</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  name="contact"
                  className="form-control"
                  value={formData.contact}
                  onChange={handleInputChange}
                  maxLength="10"
                  required
                />
              </div>
            </div>

            {/* Languages */}
            <div className="row mb-3 align-items-start">
              <label className="col-sm-2 col-form-label">Languages</label>
              <div className="col-sm-10 d-flex flex-wrap gap-3">
                {languageOptions.map((lang, idx) => (
                  <div key={idx} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={lang}
                      id={`language-${idx}`}
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => handleCheckboxChange(e, 'languages')}
                    />
                    <label className="form-check-label ms-1" htmlFor={`language-${idx}`}>
                      {lang}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="row mb-3 align-items-start">
              <label className="col-sm-2 col-form-label">Availability</label>
              <div className="col-sm-10 d-flex flex-wrap gap-3">
                {availabilityOptions.map((slot, idx) => (
                  <div key={idx} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={slot}
                      id={`availability-${idx}`}
                      checked={formData.availability.includes(slot)}
                      onChange={(e) => handleCheckboxChange(e, 'availability')}
                    />
                    <label className="form-check-label ms-1" htmlFor={`availability-${idx}`}>
                      {slot}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">Price</label>
              <div className="col-sm-10">
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* City */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-2 col-form-label">City</label>
              <div className="col-sm-10">
                <select
                  name="city"
                  className="form-select"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a city</option>
                  {cityOptions.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success w-50 mt-4">
                Save Changes
              </button>
            </div>

            <div className="text-center mt-2">
              <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default guidedetails;
