import React, { useContext, useState, useRef, useEffect } from "react";
import { UserGuideContextobj } from "../../contexts/UserGuidecontext";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Header.css";

function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserGuideContextobj);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <div className="bg-overlay">
      <div className="glass-navbar d-flex justify-content-between align-items-center px-4 py-2">
        <div className="navbar-logo">
          <h3 className="m-0 fw-bold text-white">VoyageR</h3>
        </div>

        {!isSignedIn ? (
          <ul className="nav-list d-flex m-0 p-0 list-unstyled">
            <li className="nav-item mx-3">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="signin" className="nav-link">SignIn</Link>
            </li>
            <li className="nav-item mx-3">
              <Link to="signup" className="nav-link">SignUp</Link>
            </li>
          </ul>
        ) : (
          <div className="d-flex align-items-center text-light">
           <Link to="destinations" className="des-link me-3"> Destinations </Link>


            {/* Profile Section */}
            <div className="text-white text-center me-3 position-relative">
              <img
                src={user?.imageUrl}
                height="40"
                width="40"
                className="rounded-circle cursor-pointer"
                alt="profile"
                onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown visibility
              />
              <div>{user?.username}</div>

              {/* Profile Dropdown */}
              {showDropdown && (
                <div ref={dropdownRef} className="profile-dropdown shadow-sm">
                  <div className="profile-details">
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.emailAddresses[0].emailAddress}</p>
                  </div>
                  <button className="btn btn-outline-danger w-100" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
