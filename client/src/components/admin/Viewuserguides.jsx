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
      fetchData(); // Refresh data after toggle
    } catch (error) {
      console.error('Error updating block status:', error);
    }
    setLoading(false);
  };

  const renderTable = (title, data) => (
    <>
      <h2>{title}</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '30px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Profile</th>
            <th>Role</th>
            <th>Status</th>
            <th>Block/Unblock</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <img
                  src={user.profileImgUrl || "https://via.placeholder.com/40"}
                  alt="profile"
                  width="40"
                  height="40"
                  style={{ borderRadius: '50%' }}
                />
              </td>
              <td>{user.role}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button
                  disabled={loading}
                  onClick={() => toggleBlockStatus(user._id, user.isBlocked)}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Users and Guides Management</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {renderTable("Users", users)}
          {renderTable("Guides", guides)}
        </>
      )}
    </div>
  );
}

export default Viewuserguides;
