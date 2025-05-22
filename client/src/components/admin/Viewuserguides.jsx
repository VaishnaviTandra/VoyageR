import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Viewuserguides() {
  const [users, setUsers] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, guideRes] = await Promise.all([
        axios.get('http://localhost:3000/user-api/users'),
        axios.get('http://localhost:3000/guide-api/guides')
      ]);

      setUsers(userRes?.data?.payload || []);
      setGuides(guideRes?.data?.payload || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers([]);
      setGuides([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBlockStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:3000/user-api/block-status/${id}`, {
        isBlocked: !currentStatus
      });
      fetchData();
    } catch (error) {
      console.error('Error updating block status:', error);
    }
    setLoading(false);
  };

  const renderCards = (title, data) => (
    <>
      <h2 className='text-light' style={{ marginBottom: '20px' }}>{title}</h2>
      <div className="cards-container">
        {(data || []).map(user => (
          <div key={user._id} className="glass-card">
            <div className="top-row">
              <h5 className="username">{user.username}</h5>
              <img
                src={user.profileImgUrl || "https://via.placeholder.com/80"}
                alt="profile"
                className="profile-img"
              />
            </div>
            <div className="info">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.isBlocked ? 'Blocked' : 'Active'}</p>
              <button
                disabled={loading}
                onClick={() => toggleBlockStatus(user._id, user.isBlocked)}
                className="glass-btn"
              >
                {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
          gap: 20px;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
          padding: 20px;
          color: #000;
          display: flex;
          flex-direction: column;
          gap: 15px;
          min-height: 220px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2);
        }
        .top-row {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          gap: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding-bottom: 10px;
        }
        .username {
          flex-grow: 1;
          text-align: center;
          margin: 0;
          font-weight: 700;
          font-size: 1.2rem;
        }
        .profile-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .info p {
          margin: 6px 0;
          font-size: 0.9rem;
        }
        .glass-btn {
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          color: #000;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .glass-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.5);
        }
        .glass-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
      <h1 style={{ marginBottom: '40px' }}>Users and Guides Management</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {renderCards("Users", users)}
          {renderCards("Guides", guides)}
        </>
      )}
    </div>
  );
}

export default Viewuserguides;
