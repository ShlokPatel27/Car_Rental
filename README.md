# Car Rental System

This is a full-stack car rental web application built using the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless interface for users to browse, rent, and manage vehicles.

## Features

- **Frontend:** React with Vite, styled using Tailwind CSS for a modern, responsive design. Routing handled by React Router.
- **Backend:** Node.js and Express server with a MongoDB database (via Mongoose).
- **Authentication:** Secure user authentication configured with JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Image Management:** Integrated with ImageKit and Multer for efficient image uploads and delivery.
- **State Management:** React hooks and context/similar tools for managing the frontend application state.

## Tech Stack

- **Client:** React 19, Tailwind CSS v4, Vite, Axios, React Router v7.
- **Server:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt, ImageKit, Multer.

## Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js installed
- MongoDB installed locally or a MongoDB Atlas connection string
- ImageKit account (for cloud image uploads)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShlokPatel27/Car_Rental.git
   cd Car_Rental
   ```

2. **Install Server Dependencies & Configure Environment Variables:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server/` directory and add your configuration variables (e.g., MongoDB URI, ImageKit keys, JWT Secret).

3. **Install Client Dependencies & Configure Environment Variables:**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file inside the `client/` directory and add your frontend configuration details (e.g., API base URL).

### Running the Application

1. **Start the Backend Server:**
   Open a terminal and run:
   ```bash
   cd server
   npm run start
   # or for development mode
   npm run server
   ```

2. **Start the Frontend Application:**
   Open a new terminal and run:
   ```bash
   cd client
   npm run dev
   ```

3. The client will be running on `http://localhost:5173` (or the port specified by Vite) and interacting with your Express server.
