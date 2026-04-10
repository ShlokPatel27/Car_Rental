import React, { useState, useEffect } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { user, setUser, axios, userLoading } = useAppContext();

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const defaultProfile =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const updateImage = async () => {
    try {
      if (!imageFile) return;

      const formData = new FormData();
      formData.append("image", imageFile);

      const { data } = await axios.post(
        "/api/owner/update-image",
        formData
      );

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        setImageFile(null);
        setPreviewUrl("");

        toast.success("Profile updated ✅");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 w-full max-w-60 border-r border-gray-200 bg-white">

     
      <div className="relative flex flex-col items-center">

        
        {imageFile && (
          <button
            onClick={updateImage}
            style={{
              position: "absolute",
              top: "-45px",
              padding: "6px 14px",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "20px",
              fontWeight: "bold",
              zIndex: 1000,
            }}
          >
            Save
          </button>
        )}

        <label htmlFor="image" className="cursor-pointer group relative">
          <img
            src={
              previewUrl
                ? previewUrl
                : userLoading
                ? defaultProfile
                : user?.image || defaultProfile
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />

          <input
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="absolute inset-0 bg-black/30 rounded-full hidden group-hover:flex items-center justify-center">
            <img src={assets.edit_icon} className="w-5" alt="" />
          </div>
        </label>
      </div>

      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 uppercase font-semibold">
          Owner
        </p>
        <p className="text-base font-bold text-gray-800">
          {user?.name || "User"}
        </p>
      </div>

     
      <div className="w-full mt-8">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end   
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
           
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? link.coloredIcon : link.icon}
                  className="w-5"
                  alt=""
                />
                <span>{link.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;