import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from "@auth0/auth0-react";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import ErrorPage from "./error-page";
import Forgot from "./pages/Forgot";
import Create from "./pages/Create";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot",
    element: <Forgot/>,
  },
  {
    path: "/create",
    element: <Create/>
  }, 
  // {
  //   path: "/rooms"
  //   element: <Rooms/>
  // }
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider>
     <RouterProvider router={router} />
    </Auth0Provider>
  </StrictMode>,
)
