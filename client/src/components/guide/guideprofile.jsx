import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GuideProfile() {
  const navigate = useNavigate();

  const languageOptions = ['English', 'Hindi', 'Punjabi', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Tamil'];
  const availabilityOptions = ['8am-9pm', '9am-10pm', '10am-11pm'];
  const cityOptions = ['Delhi', 'Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Varanasi', 'Goa', 'Amritsar', 'Shimla', 'Udaipur'];

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact: '',
    profileImgUrl: '',
    role: 'guide',
    firstName: '',
    lastName: '',
    languages: [],
    availability: [],
    price: '',
    city: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setFormData((prev) => ({
        ...prev,
        username: storedUser.username || '',
        email: storedUser.email || '',
        profileImgUrl: storedUser.profileImgUrl || '',
        firstName: storedUser.firstName || '',
        lastName: storedUser.lastName || ''
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, contact, price, city } = formData;

    if (!username.trim() || !email.trim() || !price || !city.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    if (parseInt(price) <= 0) {
      alert('Price must be a positive number.');
      return;
    }
console.log(formData)
    const payload = {
      username: formData.username,
      email: formData.email,
      contact: parseInt(formData.contact),
      profileImgUrl: formData.profileImgUrl,
      role: 'guide',
      firstName: formData.firstName,
      lastName: formData.lastName,
      guides: [{
        languages: formData.languages,
        availability: formData.availability,
        price: parseInt(formData.price),
        city: formData.city
      }]
    };

    try {
      await axios.post('http://localhost:3000/guide-api/guides', payload);
      alert('Form submitted successfully!');
      navigate('/guidedetails');
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error);
      alert('Something went wrong while submitting the form.');
    }
  };

  if (!currentUser) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4">Guide Profile</h2>
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                disabled
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group row mt-3">
            <label className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                disabled
              />
            </div>
          </div>

          {/* Profile Image */}
          <div className="form-group row mt-3">
            <label className="col-sm-2 col-form-label">Profile Image</label>
            <div className="col-sm-10">
              {formData.profileImgUrl ? (
                <img src={formData.profileImgUrl} alt="Profile" width="100" height="100" className="rounded-circle" />
              ) : (
                <p>No profile image available</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="form-group row mt-3">
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
          <div className="form-group row mt-4">
            <label className="col-sm-2 col-form-label">Languages</label>
            <div className="col-sm-10">
              <div className="row">
                {languageOptions.map((lang, idx) => (
                  <div className="col-md-3 col-sm-4" key={idx}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={lang}
                        checked={formData.languages.includes(lang)}
                        onChange={(e) => handleCheckboxChange(e, 'languages')}
                      />
                      <label className="form-check-label">{lang}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="form-group row mt-4">
            <label className="col-sm-2 col-form-label">Availability</label>
            <div className="col-sm-10">
              <div className="row">
                {availabilityOptions.map((slot, idx) => (
                  <div className="col-md-3 col-sm-4" key={idx}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={slot}
                        checked={formData.availability.includes(slot)}
                        onChange={(e) => handleCheckboxChange(e, 'availability')}
                      />
                      <label className="form-check-label">{slot}</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="form-group row mt-4">
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
          <div className="form-group row mt-4">
            <label className="col-sm-2 col-form-label">City</label>
            <div className="col-sm-10">
              <select
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a city</option>
                {cityOptions.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="form-group mt-4 text-center">
            <button type="submit" className="btn btn-primary w-50">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default GuideProfile;
