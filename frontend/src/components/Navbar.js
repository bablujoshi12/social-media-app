import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let userId = null;

  if (token) {
    try {
      const decodedUser = jwtDecode(token);
      userId = decodedUser._id;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    toast.success("Successfully logged out");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleSuggestions = () => {
    // Close mobile/tablet navbar
    const navbar = document.getElementById("mobileNavbar");

    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show");
    }

    // Scroll to suggestions
    setTimeout(() => {
      const suggestionsSection = document.getElementById("suggestions");

      if (suggestionsSection) {
        suggestionsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <nav className="navbar bg-white border-bottom shadow-sm">
      <div className="container">
        {/* Desktop Navbar */}
        <div className="d-none d-lg-flex w-100 justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold fs-4" to="/home">
            Social Connect
          </Link>

          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile + Tablet Navbar */}
        <div className="d-flex d-lg-none w-100 justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold fs-4" to="/home">
            Social Connect
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileNavbar"
            aria-controls="mobileNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Mobile + Tablet Menu */}
        <div className="collapse d-lg-none w-100" id="mobileNavbar">
          <ul className="navbar-nav mt-3">
            {/* Home */}
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to="/home"
              >
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
              </Link>
            </li>

            {/* Search */}
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to="/search"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Search</span>
              </Link>
            </li>

            {/* Suggested for You */}
            <li className="nav-item">
              <button
                type="button"
                className="nav-link border-0 bg-transparent d-flex align-items-center gap-2 w-100 text-start"
                onClick={handleSuggestions}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Suggested for you</span>
              </button>
            </li>

            {/* Profile */}
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to={userId ? `/profile/${userId}` : "/login"}
              >
                <i className="fa-solid fa-user"></i>
                <span>Profile</span>
              </Link>
            </li>

            {/* Logout */}
            <li className="nav-item mt-2">
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-2"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
