import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function MobileSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  const token = localStorage.getItem("token");

  const getSuggestions = async () => {
    try {
      if (!token) return;

      const decodedUser = jwtDecode(token);

      const response = await fetch(
        "http://localhost:8080/users/search/username?username=",
        {
          method: "GET",
          headers: {
            authorization: token,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.message);
      }

      const otherUsers = result.users.filter(
        (user) => user._id.toString() !== decodedUser._id.toString(),
      );

      const randomUsers = [...otherUsers]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      setSuggestions(randomUsers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/users/${userId}/follow`,
        {
          method: "POST",
          headers: {
            authorization: token,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);

      const currentUserId = jwtDecode(token)._id;

      setSuggestions((currentSuggestions) =>
        currentSuggestions.map((user) => {
          if (user._id.toString() === userId.toString()) {
            const isFollowing = user.followers?.some(
              (followerId) =>
                followerId.toString() === currentUserId.toString(),
            );

            return {
              ...user,
              followers: isFollowing
                ? user.followers.filter(
                    (id) => id.toString() !== currentUserId.toString(),
                  )
                : [...(user.followers || []), currentUserId],
            };
          }

          return user;
        }),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!token) {
    return null;
  }

  const currentUserId = jwtDecode(token)._id;

  return (
    <div
      id="suggestions"
      className="d-lg-none mb-4 mt-5"
      style={{
        scrollMarginTop: "80px",
      }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-0">Suggested for you</h6>

              <small className="text-muted">People you may know</small>
            </div>

            <Link
              to="/search"
              className="btn btn-sm btn-link text-decoration-none p-0"
            >
              See All
            </Link>
          </div>

          {/* Suggestions */}
          <div
            className="d-flex gap-3 overflow-auto pb-2"
            style={{
              scrollbarWidth: "none",
            }}
          >
            {suggestions.map((user) => {
              const isFollowing = user.followers?.some(
                (followerId) =>
                  followerId.toString() === currentUserId.toString(),
              );

              return (
                <div
                  key={user._id}
                  className="card border flex-shrink-0 text-center"
                  style={{
                    width: "145px",
                  }}
                >
                  <div className="card-body p-3">
                    {/* Profile Image */}
                    <Link
                      to={`/profile/${user._id}`}
                      className="text-decoration-none"
                    >
                      <div
                        className="rounded-circle overflow-hidden mx-auto mb-2"
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <img
                          src={
                            user.profileImage?.startsWith("http")
                              ? user.profileImage
                              : `http://localhost:8080/${user.profileImage}`
                          }
                          alt={user.username}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <h6
                        className="fw-bold text-dark mb-1 text-truncate"
                        title={user.username}
                      >
                        {user.username}
                      </h6>
                    </Link>

                    <small
                      className="text-muted d-block text-truncate mb-2"
                      title={user.bio || ""}
                    >
                      {user.bio || "Suggested for you"}
                    </small>

                    {/* Follow */}
                    <button
                      className={`btn btn-sm w-100 ${
                        isFollowing ? "btn-outline-secondary" : "btn-primary"
                      }`}
                      onClick={() => handleFollow(user._id)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              );
            })}

            {suggestions.length === 0 && (
              <small className="text-muted">No suggestions available</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSuggestions;
