import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!userId) throw new Error("User not logged in");
        const res = await axios.get(`http://localhost:3000/user-api/user-bookings/${userId}`);
        setBookings(res.data.bookings);
      } catch (err) {
        setError("Failed to load bookings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="user-bookings-container">
      <h2>Your Hotel Bookings</h2>
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
  );
};

export default UserBookings;
