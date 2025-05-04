import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import '../../styles/Signin.css'  // Custom CSS for styling

function Signin() {
  return (
    <div className="signin-container">
      <SignIn />
    </div>
  )
}

export default Signin
