import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";

// ==========================
// Change Role to Owner
// ==========================
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    // Added { new: true } to return the updated document if needed
    await User.findByIdAndUpdate(_id, { role: "owner" });

    res.json({
      success: true,
      message: "Now you can list cars",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Add Car
// ==========================
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const carData = JSON.parse(req.body.carData);
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    // Upload to ImageKit
    // Use file.buffer for memoryStorage or fs.readFileSync(file.path) for diskStorage
    const response = await imagekit.upload({
      file: file.buffer, 
      fileName: file.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({
      ...carData,
      owner: _id,
      image: optimizedImageUrl,
    });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Get Owner Cars
// ==========================
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Toggle Availability
// ==========================
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car || car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvaliable = !car.isAvaliable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Delete Car (Soft Delete)
// ==========================
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car || car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvaliable = false;
    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Dashboard Data
// ==========================
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const completedBookings = bookings.filter((b) => b.status === "confirmed");

    const monthlyRevenue = completedBookings.reduce(
      (acc, booking) => acc + booking.price,
      0
    );

    res.json({
      success: true,
      dashboardData: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        recentBookings: bookings.slice(0, 3),
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ==========================
// Update Profile Image
// ==========================
export const updateUserImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.json({
        success: false,
        message: "No file uploaded",
      });
    }

    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: `profile-${userId}-${Date.now()}`,
    });

    if (!response.url) {
      return res.json({
        success: false,
        message: "Upload failed",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: response.url },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};