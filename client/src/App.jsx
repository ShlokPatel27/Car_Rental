import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// User Components & Pages
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";

// Owner Components & Pages
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from "./components/Login";
import {Toaster} from 'react-hot-toast';
import { useAppContext } from "./context/AppContext";

const App = () => {
  const {showLogin} = useAppContext()
  const location = useLocation();

  // Check if the current path starts with /owner to hide user Navbar/Footer
  const isOwnerPath = location.pathname.startsWith("/owner");

  return (
    <>
    <Toaster/>
      {/* Show User Navbar only if not in Owner section */}
      {showLogin && <Login/>}
      {!isOwnerPath && <Navbar />}
      
      <Routes>
        {/* --- User Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* --- Owner Routes with Nested Layout --- */}
        {/* The Layout component contains the Owner Navbar and Sidebar */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} /> {/* This loads at /owner */}
          <Route path="add-car" element={<AddCar />} /> {/* This loads at /owner/add-car */}
          <Route path="manage-cars" element={<ManageCars />} /> {/* This loads at /owner/manage-cars */}
          <Route path="manage-bookings" element={<ManageBookings />} /> {/* This loads at /owner/manage-bookings */}
        </Route> 
      </Routes>

      {/* Show User Footer only if not in Owner section */}
      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;