import React, { useContext } from "react";
import { UserGuideContextobj } from "../../contexts/UserGuidecontext";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk(); // Correct way to get signOut
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserGuideContextobj);

  async function handleSignOut() {
    await signOut();
    setCurrentUser(null);
    navigate("/"); // Redirect to homepage
  }

  return (
    <div>
      {!isSignedIn ? (
        <div className="d-flex justify-content-end ">
            <ul className='list-inline  list-unstyled justify-content-around '>
              <li className="list-inline-item me-5" style={{ textDecoration: "none" }}>
                <Link to="">Home</Link>
              </li>
              <li className="list-inline-item me-5" style={{ textDecoration: "none" }}>
                <Link to="signin">SignIn</Link>
              </li>
              <li className="list-inline-item " style={{ textDecoration: "none" }}>
                <Link to="signup">SignUp</Link>
              </li>
            </ul>
        </div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-end">
            <div style={{ position: "relative" }}>
              <img
                src={user?.imageUrl} // Optional chaining to avoid undefined error
                height="40px"
                width="40px"
                className="rounded-circle"
                alt="profileimgurl"
              />
              <p className="text-center mt-1">{user?.username}</p>
            </div>
            <Link to="cities">Cities</Link>
            <button className="btn btn-danger" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
