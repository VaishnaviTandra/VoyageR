import { useContext, useEffect, useState } from 'react';
import { UserGuideContextobj } from '../../contexts/UserGuidecontext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home.css';

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
  const selectedRole = e.target.value;

  // If already selected role, navigate directly
  if (currentUser?.role === selectedRole) {
    if (selectedRole === 'guide') {
      navigate(`/guide-profile/${currentUser.email}`);
    } else if (selectedRole === 'traveler') {
      navigate(`/user-profile/${currentUser.email}`);
    }
    return;
  }

  const { profileImgUrl, isActive, ...modifiedUser } = currentUser;
  const updatedUser = { ...modifiedUser, role: selectedRole };

  try {
    if (selectedRole === 'guide') {
      // ✅ Check if guide already exists
      const checkRes = await axios.get(`http://localhost:3000/guide-api/guides/${updatedUser.email}`);
      if (checkRes.data?.payload) {
        setCurrentUser(checkRes.data.payload);
        localStorage.setItem("currentUser", JSON.stringify(checkRes.data.payload));
        navigate(`/guide-profile/${updatedUser.email}`);
        return;
      }
    } else if (selectedRole === 'traveler') {
      // ✅ Check if traveler already exists
      const checkRes = await axios.get(`http://localhost:3000/user-api/users/${updatedUser.email}`);
      if (checkRes.data?.payload) {
        setCurrentUser(checkRes.data.payload);
        localStorage.setItem("currentUser", JSON.stringify(checkRes.data.payload));
        navigate(`/user-profile/${updatedUser.email}`);
        return;
      }
    }

    // If not found, proceed to create new user/guide
    let res = null;
    if (selectedRole === 'guide') {
      res = await axios.post('http://localhost:3000/guide-api/guides', updatedUser);
    } else if (selectedRole === 'traveler') {
      res = await axios.post('http://localhost:3000/user-api/users', updatedUser);
    }

    const { message, payload } = res.data;
    if (message === selectedRole || message === `${selectedRole} already exists`) {
      setCurrentUser(payload);
      localStorage.setItem("currentUser", JSON.stringify(payload));

      if (selectedRole === 'guide') {
        navigate(`/guide-profile/${payload.email}`);
      } else if (selectedRole === 'traveler') {
        navigate(`/user-profile/${payload.email}`);
      }
    } else {
      setError(message);
    }
  } catch (err) {
    setError(err.response?.data?.message || err.message || "Something went wrong");
  }
}

  return (
    <div className='glass-hero'>
      {!isSignedIn && (
        <div className="glass-card text-center">
          <h1><span className="highlight text-light fs-1">VoyageR</span></h1>
          <p className="subtitle text-light fs-2">
            <p className="fs-2">Discover destinations like never before.</p>
            Connect with local guides and unlock authentic experiences around the world.
          </p>
          <div className="glass-buttons">
            <button className="glass-btn primary ms-5 me-5">Get Started</button>
            <button className="glass-btn secondary">How it works?</button>
          </div>
        </div>
      )}

      {isSignedIn && currentUser?.role !== 'admin' && (
        <div className='container mt-5'>
          <div className='d-flex justify-content-evenly align-items-center p-4 rounded text-light'
            style={{
              backgroundColor: 'transparent',
              boxShadow: '0 4px 10px rgba(0, 123, 255, 0.6), 0 4px 20px rgba(0, 123, 255, 0.3)',
            }}>
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
                  checked={currentUser?.role === 'guide'}
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
                  checked={currentUser?.role === 'traveler'}
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
