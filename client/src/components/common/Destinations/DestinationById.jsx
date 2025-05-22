import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

const DestinationById = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [show3DGallery, setShow3DGallery] = useState(false);
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/admin-api/admin/destination/${id}`);
        setDestination(response.data.payload);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load destination details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDestination();
  }, [id]);

  useEffect(() => {
    if (show3DGallery && destination?.images?.[currentImageIndex]) {
      viewerRef.current = new Viewer({
        container: containerRef.current,
        panorama: destination.images[currentImageIndex],
        navbar: ["zoom", "fullscreen"],
      });
    }
    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, [show3DGallery, currentImageIndex, destination]);

  const goToNextImage = () => {
    if (destination?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % destination.images.length);
    }
  };

  const goToPreviousImage = () => {
    if (destination?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + destination.images.length) % destination.images.length);
    }
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

  if (!destination) {
    return <div className="text-center py-4">Destination not found</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="mb-4">{destination.nameOfDestination}</h1>

      {/* Image section with glass-card */}
      <div className="mb-4 position-relative glass-card">
        <div className="border rounded" style={{ overflow: "hidden", height: "400px" }}>
          {destination.images?.length > 0 ? (
            <div className="position-relative">
              <img
                src={destination.images[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="img-fluid w-100"
                style={{ objectFit: "cover", height: "400px" }}
              />
              {destination.images.length > 1 && (
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
          ) : (
            <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "400px" }}>
              <p className="text-muted">No images available</p>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">
            {destination.images?.length > 0
              ? `Image ${currentImageIndex + 1} of ${destination.images.length}`
              : "No images"}
          </small>
          {destination.city && (
            <a
              className="btn btn-outline-secondary btn-sm d-flex align-items-center"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.nameOfDestination + ', ' + destination.city)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Compass size={16} className="me-1" />
              View on Google Maps
            </a>
          )}
        </div>

        {destination.images?.length > 0 && (
          <div className="mt-2 text-end">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShow3DGallery(true)}
            >
              View in 3D Gallery
            </button>
          </div>
        )}
      </div>

      {/* About this destination card with glass-card */}
      <div className="mb-4 glass-card">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0">About this destination</h4>
          {destination.rating && (
            <span className="badge bg-warning text-dark fs-6">
              {destination.rating} ★
            </span>
          )}
        </div>
        <p>{destination.description}</p>
        {destination.city && <p><strong>Location:</strong> {destination.city}</p>}

        {destination.popularActivities?.length > 0 && (
          <div className="mt-3">
            <h5>Popular Activities</h5>
            <div className="d-flex flex-wrap gap-2">
              {destination.popularActivities.map((activity, idx) => (
                <span key={idx} className="badge bg-info text-dark">{activity}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3D Gallery Overlay */}
      {show3DGallery && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center z-3">
          <div className="position-relative bg-white rounded shadow" style={{ width: "80%", height: "80%" }}>
            <button
              onClick={() => setShow3DGallery(false)}
              className="btn btn-danger position-absolute top-0 end-0 m-3"
            >
              Close
            </button>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationById;
