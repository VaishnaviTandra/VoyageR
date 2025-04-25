import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div style={{ padding: "20px" }}>
      {userStatus ? (
        <div>
          <p className='text-danger fs-3 fw-semibold'>
            Your account is blocked. Please contact Admin.
          </p>
        </div>
      ) : (
        <div>
          {/* User Info */}
          <div
            style={{
              alignItems: 'center',
              gap: '20px',
              background: "#f5f5f5",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px"
            }}
          >
            <div style={{ marginTop: "20px" }}>
              <div>
                <label style={{ fontWeight: "bold" }}>Username:</label>
                <p>{currentUser.username}</p>
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>Email:</label>
                <p>{currentUser.email}</p>
              </div>
            </div>
          </div>

          {/* Button to View Bookings */}
          {!showBookings && (
            <button onClick={handleViewBookings} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
              View Recent Hotel Bookings
            </button>
          )}

          {/* Booking Info */}
          {loadingBookings && <p>Loading bookings...</p>}

          {showBookings && bookings.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h4>Recent Hotel Bookings</h4>
              {bookings.map((b, i) => (
                <div key={i} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
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
