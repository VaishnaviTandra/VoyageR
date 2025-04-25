import React from 'react'
import {ClerkProvider} from '@clerk/clerk-react'
import Header from './common/Header'
import { Outlet } from 'react-router-dom'
import Footer from './common/Footer'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {/* main layout */}
       <div>
        {/* header component */}
        <Header/>
        {/* page content */}
        <div style={{minHeight:"100vh"}}>
          <Outlet/>
        </div>
        {/* footer content */}
        <Footer/>
       </div>
    </ClerkProvider>
   
  )
}

export default RootLayout