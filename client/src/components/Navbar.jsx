import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Navbar = () => {

  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const changeRole = async()=>{
    try {
      const{data}= await axios.post('/api/owner/change-role')
      if(data.success){
        setIsOwner(true)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  
  const BREAKPOINT = 990;

  const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [BREAKPOINT]);

  const menuLinks = [
    { name: "Home", path: "/" },
    { name: "Cars", path: "/cars" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  return (
    <div className="bg-[#f1f5f9] border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center px-8 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg" alt="logo" className="h-8" />
          <span className="text-xl font-semibold text-blue-600">
            CarRental
          </span>
        </Link>

        {/* DESKTOP VIEW */}
        {!isMobile && (
          <>
            {/* Menu */}
            <div className="flex items-center gap-10 text-gray-600 font-medium ml-auto mr-10">
              {menuLinks.map((link, index) => (
                <Link key={index} to={link.path} className="hover:text-black transition">
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">

              <div className="flex items-center border border-gray-300 rounded-full px-4 py-1.5 bg-white w-64">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full outline-none text-sm text-gray-600 bg-transparent"
                />
                <span className="text-gray-400 text-sm">🔍</span>
              </div>

              <button
                onClick={() =>isOwner?navigate("/owner"):changeRole()}
                className="px-5 py-1.5 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                {isOwner ?'Dashboard':'List Cars'}
              </button>

              <button
                onClick={() => {user ? logout(): setShowLogin(true)}}
                className="px-5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {user ? 'Logout':'Login'}
              </button>
            </div>
          </>
        )}

        {/* MOBILE BUTTON */}
        {isMobile && (
          <button
            className="ml-auto text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open ? "✖" : "☰"}
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && open && (
        <div className="flex flex-col gap-5 px-6 pb-4 bg-[#f1f5f9]">

          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path} onClick={() => setOpen(false)}>
              {link.name}
            </Link>
          ))}

          <button
            onClick={() => {
              navigate("/dashboard");
              setOpen(false);
            }}
            className="text-left"
          >
            Dashboard
          </button>

          <div>
            <button
              onClick={() => setShowLogin(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg w-fit"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;