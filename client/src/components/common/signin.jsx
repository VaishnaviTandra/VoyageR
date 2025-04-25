import React from 'react'
import { SignIn } from '@clerk/clerk-react'
function signin() {
  return (
    <div className='justify-content-center align-items-center'>
      <div style={{width:"400px"}}>
      <SignIn/>
      </div>
    </div>
  )
}

export default signin