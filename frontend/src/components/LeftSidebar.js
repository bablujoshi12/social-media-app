import React from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LeftSidebar() {
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

  const handleCreatePost = () => {
    const createPostSection = document.getElementById("create-post");

    if (createPostSection) {
      createPostSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="col-lg-3 col-xl-2 d-none d-lg-block">
      <div className="sticky-top pt-4">
        <div className="list-group shadow-sm rounded-3">
          {/* Home */}
          <Link
            to="/home"
            className="list-group-item list-group-item-action border-0 py-3"
          >
            <i className="fa-solid fa-house"></i>
            <span className="ms-2 fw-semibold">Home</span>
          </Link>

          {/* Search */}
          <Link
            to="/search"
            className="list-group-item list-group-item-action border-0 py-3"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span className="ms-2">Search</span>
          </Link>

          {/* Notifications */}
          <button
            type="button"
            className="list-group-item list-group-item-action border-0 py-3 text-start"
            onClick={() => {
              // Notifications feature later
            }}
          >
            <i className="fa-regular fa-heart"></i>
            <span className="ms-2">Notifications</span>
          </button>

          {/* Profile */}
          <Link
            to={userId ? `/profile/${userId}` : "/login"}
            className="list-group-item list-group-item-action border-0 py-3"
          >
            <i className="fa-regular fa-user"></i>
            <span className="ms-2">Profile</span>
          </Link>

          {/* Create Post */}
          <button
            type="button"
            onClick={handleCreatePost}
            className="list-group-item list-group-item-action border-0 py-3 text-start"
          >
            <i className="fa-solid fa-plus"></i>
            <span className="ms-2">Create Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
