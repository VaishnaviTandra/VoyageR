import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import '../../styles/Signin.css'
function signup() {
  return (
    <div className="justify-content-center align-items-center signup-b">
      <div style={{width:"400px"}}>
      <SignUp/>
      </div>
      
    </div>
  )
}

export default signup