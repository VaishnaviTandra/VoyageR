import React, { createContext, useState, useEffect } from 'react';

// 1️⃣ Create and export context
export const UserGuideContextobj = createContext();

function UserGuideContext({ children }) {
  // 2️⃣ Define shared state
  const [currentUser, setCurrentUser] = useState({
    username: '',
    email: '',
    contact: '',
    profileImgUrl: '',
    role: ''
  });

  // 3️⃣ Load user from localStorage safely
  useEffect(() => {
    try {
      const userInStorage = localStorage.getItem('currentUser');
      if (userInStorage) {
        setCurrentUser(JSON.parse(userInStorage));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }, []);

  return (
    // 4️⃣ Provide context value
    <UserGuideContextobj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserGuideContextobj.Provider>
  );
}

export default UserGuideContext;
