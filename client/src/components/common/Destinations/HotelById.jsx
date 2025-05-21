import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

const HotelById = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVRMode, setIsVRMode] = useState(false);

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
    <div className="container my-4">
      <h1 className="mb-4">{hotel.nameOfHotel}</h1>

      {/* Images and VR Mode */}
      <div className="mb-4 position-relative">
        <div className={`border rounded ${isVRMode ? "vh-100" : "vh-50"}`} style={{ overflow: "hidden" }}>
          {hotel.images?.length > 0 ? (
            isVRMode ? (
              <div className="w-100 h-100">
                <a-scene embedded>
                  <a-assets>
                    {hotel.images.map((img, index) => (
                      <img key={index} id={`img-${index}`} src={img} crossOrigin="anonymous" />
                    ))}
                  </a-assets>

                  <a-entity>
                    <a-curvedimage
                      src={`#img-${currentImageIndex}`}
                      height="3"
                      radius="3"
                      theta-length="180"
                      position="0 1.6 0"
                      rotation="0 90 0"
                    ></a-curvedimage>
                  </a-entity>

                  <a-sky color="#333"></a-sky>

                  <a-camera position="0 1.6 0" look-controls>
                    <a-cursor color="#FFFFFF"></a-cursor>
                  </a-camera>

                  <a-entity position="-2 1.6 -1">
                    <a-box color="#333" depth="0.1" height="0.3" width="0.3" onClick={goToPreviousImage}>
                      <a-text value="<" align="center" position="0 0 0.06" scale="0.5 0.5 0.5" color="#FFF" />
                    </a-box>
                  </a-entity>

                  <a-entity position="2 1.6 -1">
                    <a-box color="#333" depth="0.1" height="0.3" width="0.3" onClick={goToNextImage}>
                      <a-text value=">" align="center" position="0 0 0.06" scale="0.5 0.5 0.5" color="#FFF" />
                    </a-box>
                  </a-entity>
                </a-scene>
              </div>
            ) : (
              <div className="position-relative">
                <img
                  src={hotel.images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="img-fluid w-100"
                  style={{ objectFit: "cover", height: "400px" }}
                />
                {hotel.images.length > 1 && (
                  <>
                    <button
                      onClick={goToPreviousImage}
                      className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                      style={{ zIndex: 10 }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                      style={{ zIndex: 10 }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            )
          ) : (
            <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "400px" }}>
              <p className="text-muted">No images available</p>
            </div>
          )}
        </div>

        {/* VR Mode Toggle */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">
            {hotel.images?.length > 0 ? `Image ${currentImageIndex + 1} of ${hotel.images.length}` : "No images"}
          </small>
          
        </div>
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
          <div className="mt-3">
            <h5>Luxuries</h5>
            <div className="d-flex flex-wrap gap-2">
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
      </div>
    </div>
  );
};

export default HotelById;
