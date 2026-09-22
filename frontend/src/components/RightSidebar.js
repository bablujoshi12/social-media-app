import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function RightSidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const token = localStorage.getItem("token");

  const getCurrentUser = async () => {
    try {
      const decodedUser = jwtDecode(token);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${decodedUser._id}`,
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

      setCurrentUser(result.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSuggestions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/search/username?username=`,
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

      const decodedUser = jwtDecode(token);

      const otherUsers = result.users.filter(
        (user) => user._id.toString() !== decodedUser._id.toString(),
      );

      const randomUsers = [...otherUsers]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      setSuggestions(randomUsers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!token) return;

    getCurrentUser();
    getSuggestions();
  }, [token]);

  const handleFollow = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}/follow`,
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

  if (!currentUser) {
    return null;
  }

  const currentUserId = jwtDecode(token)._id;

  return (
    <div className="col-lg-3 col-xl-3 d-none d-lg-block">
      <div className="sticky-top pt-4">
        {/* Current User */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle overflow-hidden flex-shrink-0"
              style={{
                width: "50px",
                height: "50px",
              }}
            >
              <img
                src={
                  currentUser.profileImage?.startsWith("http")
                    ? currentUser.profileImage
                    : `${process.env.REACT_APP_API_URL}/${currentUser.profileImage}`
                }
                alt={currentUser.username}
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            <div>
              <h6 className="mb-0 fw-bold">{currentUser.username}</h6>
              <small className="text-muted">Your profile</small>
            </div>
          </div>

          <Link
            to={`/profile/${currentUser._id}`}
            className="btn btn-sm btn-link text-decoration-none"
          >
            Profile
          </Link>
        </div>

        {/* Suggestions */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <small className="text-muted fw-bold">Suggested for you</small>

              <Link
                to="/search"
                className="btn btn-sm btn-link p-0 text-decoration-none"
              >
                See All
              </Link>
            </div>

            {suggestions.length === 0 ? (
              <small className="text-muted">No suggestions available</small>
            ) : (
              suggestions.map((user) => {
                const isFollowing = user.followers?.some(
                  (followerId) =>
                    followerId.toString() === currentUserId.toString(),
                );

                return (
                  <div
                    key={user._id}
                    className="d-flex align-items-center justify-content-between mb-3"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle overflow-hidden flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        <img
                          src={
                            user.profileImage?.startsWith("http")
                              ? user.profileImage
                              : `${process.env.REACT_APP_API_URL}/${user.profileImage}`
                          }
                          alt={user.username}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div>
                        <Link
                          to={`/profile/${user._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <small className="fw-bold d-block">
                            {user.username}
                          </small>
                        </Link>

                        <small className="text-muted">
                          {user.bio || "Suggested for you"}
                        </small>
                      </div>
                    </div>

                    <button
                      className={`btn btn-sm ${
                        isFollowing ? "btn-outline-secondary" : "btn-primary"
                      }`}
                      onClick={() => handleFollow(user._id)}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
