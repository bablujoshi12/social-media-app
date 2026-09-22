import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Comments from "./pages/Comments";
import Followers from "./pages/Followers";
import Following from "./pages/Following";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* ================================
            PUBLIC ROUTES
        ================================= */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* ================================
            PROTECTED ROUTES
        ================================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Followers */}
        <Route
          path="/profile/:userId/followers"
          element={
            <ProtectedRoute>
              <Followers />
            </ProtectedRoute>
          }
        />

        {/* Following */}
        <Route
          path="/profile/:userId/following"
          element={
            <ProtectedRoute>
              <Following />
            </ProtectedRoute>
          }
        />

        {/* Search */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />

        {/* Comments */}
        <Route
          path="/posts/:postId/comments"
          element={
            <ProtectedRoute>
              <Comments />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
