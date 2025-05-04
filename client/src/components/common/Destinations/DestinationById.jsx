import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

const DestinationById = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVRMode, setIsVRMode] = useState(false);

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
    if (typeof window !== 'undefined' && isVRMode) {
      import('aframe').then(() => {
        console.log("A-Frame loaded successfully");
      }).catch(err => {
        setIsVRMode(false);
        setError("Failed to load VR viewer. Please try again.");
      });
    }
  }, [isVRMode]);

  useEffect(() => {
    if (destination) {
      console.log("Updated destination name:", destination.nameOfDestination);
    }
  }, [destination]);

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

  const toggleVRMode = () => setIsVRMode(prev => !prev);

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

      <div className="mb-4 position-relative">
        <div className={`border rounded ${isVRMode ? 'vh-100' : 'vh-50'}`} style={{ overflow: "hidden" }}>
          {destination.images?.length > 0 ? (
            isVRMode ? (
              <div className="w-100 h-100">
                <a-scene embedded>
                  <a-assets>
                    {destination.images.map((img, index) => (
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
            )
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
          {destination.images?.length > 0 && (
            <button
              className={`btn ${isVRMode ? "btn-primary" : "btn-outline-secondary"} btn-sm d-flex align-items-center`}
              onClick={toggleVRMode}
            >
              <Compass size={16} className="me-1" />
              {isVRMode ? "Exit 3D Gallery" : "View in 3D Gallery"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
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
    </div>
  );
};

export default DestinationById;
