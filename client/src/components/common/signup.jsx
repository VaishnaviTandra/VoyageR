import React from 'react'
import { SignUp } from '@clerk/clerk-react'
function signup() {
  return (
    <div className="justify-content-center align-items-center">
      <div style={{width:"400px"}}>
      <SignUp/>
      </div>
      
    </div>
  )
}

export default signup