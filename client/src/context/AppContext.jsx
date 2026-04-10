import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  // LOAD USER FROM LOCALSTORAGE 
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userLoading, setUserLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // FETCH USER 
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user?.role?.toLowerCase() === "owner");

        // SAVE TO LOCALSTORAGE
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        setIsOwner(false);
        localStorage.removeItem("user");
      }
    } catch (error) {
      setUser(null);
      setIsOwner(false);
      localStorage.removeItem("user");
    } finally {
      setUserLoading(false);
    }
  };

  // FETCH CARS
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // LOGOUT 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsOwner(false);

    axios.defaults.headers.common["Authorization"] = "";

    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${storedToken}`;

      fetchUser();
    } else {
      setUserLoading(false);
    }

    fetchCars();
  }, []);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser, 
    token,
    setToken,
    isOwner,
    setIsOwner,
    userLoading,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};