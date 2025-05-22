import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserProfile.css' // Ensure you create this file

function UserProfile() {
  const [userStatus, setUserStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setUserStatus(storedUser.isBlocked);
    }
  }, []);

  const handleViewBookings = async () => {
    if (!currentUser) return;

    setLoadingBookings(true);
    try {
      const res = await axios.get(`http://localhost:3000/user-api/user-bookings/${currentUser._id}`);
      setBookings(res.data.bookings);
      setShowBookings(true);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="user-profile-container">
      {userStatus ? (
        <div>
          <p className="text-danger fs-3 fw-semibold">
            Your account is blocked. Please contact Admin.
          </p>
        </div>
      ) : (
        <div>
          {/* Glassmorphic User Info */}
          <div className="glass-card user-info-card">
            <h3 className="mb-3">User Profile</h3>
            <div>
              <label><strong>Username:</strong></label>
              <p>{currentUser.username}</p>
            </div>
            <div>
              <label><strong>Email:</strong></label>
              <p>{currentUser.email}</p>
            </div>
          </div>

          {/* View Bookings Button */}
          {!showBookings && (
            <button className="view-bookings-btn" onClick={handleViewBookings}>
              View Recent Hotel Bookings
            </button>
          )}

          {loadingBookings && <p>Loading bookings...</p>}

          {/* Glassmorphic Bookings List */}
          {showBookings && bookings.length > 0 && (
            <div className="bookings-section">
              <h4>Recent Hotel Bookings</h4>
              {bookings.map((b, i) => (
                <div className="glass-card booking-card" key={i}>
                  <h5>{b.hotelName} ({b.location})</h5>
                  <p>Check-In: {new Date(b.checkIn).toLocaleDateString()}</p>
                  <p>Check-Out: {new Date(b.checkOut).toLocaleDateString()}</p>
                  <p>Total Price: ₹{b.totalPrice}</p>
                  <p>Status: <strong>{b.paymentStatus}</strong></p>
                </div>
              ))}
            </div>
          )}

          {showBookings && bookings.length === 0 && (
            <p>No bookings found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
