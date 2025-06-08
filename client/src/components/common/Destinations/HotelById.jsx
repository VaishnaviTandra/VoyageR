import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HotelById = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVRMode, setIsVRMode] = useState(false);

  // Get user role from localStorage (or replace with your actual auth logic)
  const userRole = localStorage.getItem("userRole"); // e.g. "user" or "guide"

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/admin-api/admin/hotels3/${id}`);
        setHotel(response.data.payload);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotel();
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined" && isVRMode) {
      import("aframe")
        .then(() => console.log("A-Frame loaded successfully"))
        .catch((err) => {
          setIsVRMode(false);
          setError("Failed to load VR viewer. Please try again.");
        });
    }
  }, [isVRMode]);

  const goToNextImage = () => {
    if (hotel?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
    }
  };

  const goToPreviousImage = () => {
    if (hotel?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
    }
  };

  const toggleVRMode = () => setIsVRMode((prev) => !prev);

  const handleBookNow = () => {
    alert(`Booking functionality for ${hotel.nameOfHotel} is not implemented yet.`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!hotel) {
    return <div className="text-center py-4">Hotel not found</div>;
  }

  return (
    <div className="container my-4" style={{ color: "white" }}>
      <style>{`
        .luxuries-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .badge {
          background-color: #28a745 !important;
          font-weight: 500;
        }
        .btn-book-now {
          background-color: #007bff;
          border: none;
          padding: 10px 20px;
          font-weight: 600;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 20px;
          display: inline-block;
        }
        .btn-book-now:hover {
          background-color: #0056b3;
        }
      `}</style>

      <h1 className="mb-4">{hotel.nameOfHotel}</h1>

      {/* Images and VR Mode */}
      <div className="mb-4 position-relative">
        {/* ... your existing image/VR code ... */}
      </div>

      {/* Hotel Details */}
      <div className="mb-4">
        <h4>About this Hotel</h4>

        <p><strong>Hotel Name:</strong> {hotel.nameOfHotel}</p>

        {hotel.address && (
          <p><strong>Location:</strong> {`${hotel.address.landmark}, ${hotel.address.city}, ${hotel.address.state} - ${hotel.address.pincode}`}</p>
        )}

        <p><strong>Cost per Day:</strong> ₹{hotel.costperDay}</p>

        <p><strong>Available Rooms:</strong> {hotel.availableRooms}</p>

        {hotel.luxuries?.length > 0 && (
          <div className="mt-3 text-center">
            <h5>Luxuries</h5>
            <div className="luxuries-container">
              {hotel.luxuries.map((luxury, idx) => (
                <span key={idx} className="badge bg-success">{luxury}</span>
              ))}
            </div>
          </div>
        )}

        {hotel.rating && (
          <div className="mt-3">
            <h5>Rating</h5>
            <span className="badge bg-warning text-dark fs-6">
              {hotel.rating} ★
            </span>
          </div>
        )}

        {hotel.bookings?.length > 0 && (
          <div className="mt-4">
            <h5>Bookings</h5>
            <ul className="list-group">
              {hotel.bookings.map((booking, idx) => (
                <li key={idx} className="list-group-item">
                  Check-In: {new Date(booking.checkIn).toLocaleDateString()} | 
                  Check-Out: {new Date(booking.checkOut).toLocaleDateString()} | 
                  Payment Status: <strong>{booking.paymentStatus}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Book Now Button: Only show if role is 'user' */}
        {userRole === "user" && (
          <button className="btn-book-now" onClick={handleBookNow}>Book Now</button>
        )}
      </div>
    </div>
  );
};

export default HotelById;
