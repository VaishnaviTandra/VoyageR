import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import RootLayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import SignIn from './components/common/signin.jsx';
import SignUp from './components/common/signup.jsx';
import UserProfile from './components/user/userprofile.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Destinations from './components/common/Destinations/Destinations.jsx';
import DestinationById from './components/common/Destinations/DestinationById.jsx';
import HotelById from './components/common/Destinations/HotelById.jsx';
import GuideProfile from './components/guide/guideprofile.jsx';
import AdminProfile from './components/admin/AdminProfile.jsx';
import PostDestination from './components/admin/PostDestination.jsx';
import PostHotel from './components/admin/PostHotel.jsx';
import Userguidecontext from './contexts/UserGuidecontext.jsx';
import Viewuserguides from './components/admin/Viewuserguides.jsx';
import Guidedetails from './components/guide/guidedetails.jsx';
import Cities from './components/common/Destinations/Cities.jsx';
import CityById from './components/common/Destinations/CityById.jsx';
import Hotels from './components/common/Destinations/Hotels.jsx';
import ViewguidesbyCity from './components/guide/ViewguidesbyCity.jsx';
import HotelBookingsForm from './components/common/Destinations/HotelBookingForm.jsx';
import UserBookings from './components/user/UserBookings.jsx';
const browserRouterObj = createBrowserRouter([
  {
    path: '',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'signin',
        element: <SignIn />
      },
      {
        path: 'signup',
        element: <SignUp />
      },

      // ✅ Top-level public destinations route (fixes 404)
      {
        path: 'destinations',
        element: <Destinations />
          
      },
      {
        path: 'destinationbyid/:id',
        element: <DestinationById />
      },{
        path:"cities",
        element:<Cities/>
      },{
        path:"cities/:id",
        element:<CityById/>
      },{
        path:'hotels',
        element:<Hotels/>
      },{
        path:'hotelbyid/:id',
        element:<HotelById/>
      },{
        path:'guides',
        element:<ViewguidesbyCity/>
      },
{
path:'book-hotel/:id',
element:<HotelBookingsForm/>
},{
path:'user-bookings',
element:<UserBookings/>
},
      // ✅ User profile route
      {
        path: 'user-profile/:email',
        element: <UserProfile />,
        children: [
          {
            path: 'destinations',
            element: <Destinations />
          },
          {
            path: 'destinationbyid',
            element: <DestinationById />,
            children: [
              {
                path: 'hotelbyid',
                element: <HotelById />
              }
            ]
          },
          {
            path: '',
            element: <Navigate to="destinations" />
          }
        ]
      },

      // ✅ Guide profile route
      {
        path: 'guide-profile/:email',
        element: <GuideProfile />,
        children: [
          {
            path: 'destinations',
            element: <Destinations />
          },
          {
            path: 'destinationbyid',
            element: <DestinationById />,
            children: [
              {
                path: 'hotelbyid',
                element: <HotelById />
              }
            ]
          },
          {
            path: '',
            element: <Navigate to="destinations" />
          }
        ]
      },{
        path:'guidedetails',
        element:<Guidedetails/>
      },

      // ✅ Admin profile route
      {
        path: 'admin-profile/:email',
        element: <AdminProfile />,
        children: [
          {
            path: 'postdestination',
            element: <PostDestination />
          },
          {
            path: 'posthotel',
            element: <PostHotel />
          },
          {
            path: 'viewuserguides',
            element: <Viewuserguides />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Userguidecontext>
      <RouterProvider router={browserRouterObj} />
    </Userguidecontext>
  </StrictMode>
);
