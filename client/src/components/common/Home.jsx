import { useContext, useEffect, useState } from 'react';
import { UserGuideContextobj } from '../../contexts/UserGuidecontext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home.css'


function Home() {
  const { currentUser, setCurrentUser } = useContext(UserGuideContextobj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.emailAddresses[0].emailAddress;
      const isAdmin = userEmail === 'vaishnavitandra17@gmail.com';

      setCurrentUser(prev => ({
        ...prev,
        username: user.fullName || `${user.firstName}_${user.lastName}`,
        email: userEmail,
        profileImgUrl: user.imageUrl,
        role: isAdmin ? 'admin' : '',
      }));

      if (isAdmin) {
        navigate(`/admin-profile/${userEmail}`);
      }
    }
  }, [isLoaded, user, setCurrentUser, navigate]);

  async function onSelectRole(e) {
    setError('');
    const { profileImageUrl, isActive, ...modifiedUser } = currentUser;
    const selectedRole = e.target.value;
    const updatedUser = { ...modifiedUser, role: selectedRole };

    try {
      let res = null;
      if (selectedRole === 'guide') {
        res = await axios.post('http://localhost:3000/guide-api/guides', updatedUser);
      } else if (selectedRole === 'traveler') {
        res = await axios.post('http://localhost:3000/user-api/users', updatedUser);
      }

      const { message, payload } = res.data;
      if (message === selectedRole) {
        setCurrentUser(payload);
        localStorage.setItem("currentUser", JSON.stringify(payload));
      } else {
        setError(message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    }
  }

  useEffect(() => {
    if (currentUser?.role === "traveler" && !error) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "guide" && !error) {
      navigate(`/guide-profile/${currentUser.email}`);
    }
  }, [currentUser, error, navigate]);

  return (
    <div className='glass-hero'>
      {!isSignedIn && (
        <div className="glass-card text-center">
          <h1><span className="highlight text-light">VoyageR</span></h1>
          <p className="subtitle text-light fs-4">
          <p>Discover destinations like never before.</p>
          Connect with local guides and unlock authentic experiences around the world.
          </p>
          <div className="glass-buttons">
            <button className="glass-btn primary">Get Started</button>
            <button className="glass-btn secondary">How it works?</button>
          </div>
        </div>
      )}

      {isSignedIn && currentUser?.role !== 'admin' && (
        <div className='container mt-5'>
          <div className='d-flex justify-content-evenly align-items-center p-4 rounded text-light'  // Increased padding from p-3 to p-4
          style={{backgroundColor: 'transparent', boxShadow: '0 4px 10px rgba(0, 123, 255, 0.6), 0 4px 20px rgba(0, 123, 255, 0.3)', // Colorful shadow effect
          }}
            >
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="profile" />
              <div>
                  <div className="d-flex justify-content-evenly text-light" style={{ gap: '10px' }}>
                  <h4>{user.firstName}</h4>
                  <h4>{user.lastName}</h4>
              </div>
            <p>{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
        <div className="text-center mt-4">
            <p className="lead fw-bold">Select your role to continue</p>
            {error && <p className="text-danger">{error}</p>}
            <div className='d-flex justify-content-center gap-5'>
              <div className="form-check">
                <input
                  type="radio"
                  name="role"
                  id="guide"
                  value="guide"
                  className="form-check-input"
                  onChange={onSelectRole}
                />
                <label htmlFor="guide" className="form-check-label">Local Guide</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="role"
                  id="traveler"
                  value="traveler"
                  className="form-check-input"
                  onChange={onSelectRole}
                />
                <label htmlFor="traveler" className="form-check-label">Traveler</label>
              </div>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}

export default Home;
