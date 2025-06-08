import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const HotelBookingsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin-api/admin/hotels3/${id}`);
        setHotel(response.data.payload);
      } catch (err) {
        setError("Failed to load hotel info");
      }
    };
    fetchHotel();
  }, [id]);

  const calculateTotalPrice = () => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const days = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (days > 0) {
      setTotalPrice(days * hotel.costperDay);
    } else {
      setTotalPrice(0);
    }
  };

  const handleBookAtHotel = async () => {
    try {
      const bookingData = {
        user: userId,
        checkIn,
        checkOut,
        totalPrice,
        paymentStatus: "pending",
      };

      // Use PUT instead of POST
      await axios.put(`http://localhost:3000/user-api/user/book-hotel/${id}`, bookingData);

      alert("Booking successful! Pay at hotel.");
      navigate("/user-bookings");  // Navigate after successful booking
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please try again.");
    }
  };

  useEffect(() => {
    if (checkIn && checkOut && hotel) {
      calculateTotalPrice();
    }
  }, [checkIn, checkOut, hotel]);

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="container text-white my-5">
      <h2 className="mb-3">Book {hotel.nameOfHotel}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div
        className="form-group mt-5"
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <label
          style={{ flex: "0 0 150px", textAlign: "right", marginRight: "1rem" }}
        >
          Check-In Date:
        </label>
        <input
          type="date"
          className="form-control"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
      </div>

      <div
        className="form-group"
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <label
          style={{ flex: "0 0 150px", textAlign: "right", marginRight: "1rem" }}
        >
          Check-Out Date:
        </label>
        <input
          type="date"
          className="form-control"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="my-3">
        <strong>Total Price: ₹{totalPrice}</strong>
      </div>
      <button className="btn btn-primary me-3" onClick={handleBookAtHotel}>
        Pay at Hotel
      </button>
      <button className="btn btn-success" disabled>
        Pay Online (Coming Soon)
      </button>
    </div>
  );
};

export default HotelBookingsForm;
