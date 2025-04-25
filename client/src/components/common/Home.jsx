import { useContext, useEffect, useState } from 'react'
import { UserGuideContextobj } from '../../contexts/UserGuidecontext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserGuideContextobj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Load Clerk user data and auto-assign admin role if email matches
  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.emailAddresses[0].emailAddress
      const isAdmin = userEmail === 'vaishnavitandra17@gmail.com'

      setCurrentUser(prev => ({
        ...prev,
        username: user.fullName || `${user.firstName}_${user.lastName}`,
        email: userEmail,
        profileImgUrl: user.imageUrl,
        role: isAdmin ? 'admin' : '', // auto assign admin role
      }))

      if (isAdmin) {
        // Admin route
        navigate(`/admin-profile/${userEmail}`)
      }
    }
  }, [isLoaded])

  // Handle role selection
  async function onSelectRole(e) {
    setError('')
    const {profileImageUrl,isActive,...modifiedUser}=currentUser
    const selectedRole = e.target.value
    const updatedUser = { ...modifiedUser, role: selectedRole }
    console.log("Selected Role:",selectedRole)
    console.log("Updated User:",updatedUser)
    try {
      let res = null
      if (selectedRole === 'guide') {
        res = await axios.post('http://localhost:3000/guide-api/guides', updatedUser)
      } else if (selectedRole === 'traveler') {
        res = await axios.post('http://localhost:3000/user-api/users', updatedUser)
      }

      const { message, payload } = res.data
      console.log(payload)
      if (message === selectedRole) {
        setCurrentUser(payload)
        localStorage.setItem("currentUser", JSON.stringify(payload))
      } else {
        setError(message)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong")
    }
  }

  // Navigate to guide/traveler profile after role is set
  useEffect(() => {
    if (currentUser?.role === "traveler" && !error) {
      navigate(`/user-profile/${currentUser.email}`)
    }
    if (currentUser?.role === "guide" && !error) {
      navigate(`/guide-profile/${currentUser.email}`)
    }
  }, [currentUser])

  return (
    <div className='container'>
      {!isSignedIn && (
        <div>
          <h2 className="text-center mt-5">Welcome to VoyageR</h2>
          <p className="lead text-center">
            Discover destinations, connect with local guides, and explore the world your way.
          </p>
        </div>
      )}

      {isSignedIn && currentUser?.role !== 'admin' && (
        <div>
          <div className='d-flex justify-content-evenly align-items-center bg-light p-3 rounded shadow-sm mt-4'>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="profile" />
            <div>
              <h4>{user.firstName}</h4>
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
  )
}

export default Home
