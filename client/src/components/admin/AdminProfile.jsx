import React from 'react'
import { Link,Outlet } from 'react-router-dom'
import { useState,useEffect } from 'react'
import '../../styles/Admin.css'
function AdminProfile() {
  const [isLoading,setIsLoading]=useState(true);
  useEffect(() => {
    // Simulate loading time (e.g., fetching user data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust delay as needed

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {isLoading?(<div>
        <p className="fs-4 mt-3">Loading Admin Panel...</p>
      </div>):(
        <div>
         <ul className="d-flex justify-content-around list-unstyled fs-3">
            <li className="nav-item">
              <Link to="postdestination" className="nav-link  mt-3 box btn btn-outline-primary fs-5 px-4 py-2">Manage Destinations</Link>
            </li>
            <li className="nav-item">
              <Link to="posthotel" className="nav-link  mt-3 box btn btn-outline-primary fs-5 px-4 py-2">Manage Hotels</Link>
            </li>
            <li className="nav-item">
              <Link to="viewuserguides" className="nav-link  mt-3 box btn btn-outline-primary fs-5 px-4 py-2">View Users and Guides</Link>
            </li>
          </ul>
          <div className="mt-5">
            <Outlet />
          </div>
          </div>
      )}
    </div>
  )
}

export default AdminProfile