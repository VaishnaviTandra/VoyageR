import { useNavigate } from "react-router-dom";
import {useState,useEffect} from 'react'
function UserProfile() {
  const [userStatus, setUserStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setUserStatus(storedUser.isBlocked);
    }
  }, []);

  const handleViewBookings = () => {
    // Navigate to UserBookings page
    navigate('/user-bookings');
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

          <button className="view-bookings-btn" onClick={handleViewBookings}>
            View Recent Hotel Bookings
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
