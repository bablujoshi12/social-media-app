import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function SearchUserCard({ user }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);

  const [isFollowing, setIsFollowing] = useState(
    user.followers?.some(
      (followerId) => followerId.toString() === currentUser._id.toString(),
    ),
  );

  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/users/${user._id}/follow`,
        {
          method: "POST",
          headers: {
            authorization: token,
          },
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        toast.error(result.message);

        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      if (!response.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);

      setIsFollowing((current) => !current);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
      {/* User Info */}
      <div className="d-flex align-items-center gap-3">
        {/* Profile Image */}
        <div
          className="rounded-circle overflow-hidden flex-shrink-0"
          style={{
            width: "52px",
            height: "52px",
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
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* User Details */}
        <div>
          <h6 className="fw-bold mb-1">{user.username}</h6>

          <small className="text-muted">@{user.username}</small>

          <div>
            <small className="text-muted">
              {user.bio || "No bio available"}
            </small>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2">
        {/* View Profile */}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          View Profile
        </button>

        {/* Follow / Unfollow */}
        <button
          className={`btn btn-sm px-3 ${
            isFollowing ? "btn-outline-secondary" : "btn-primary"
          }`}
          onClick={handleFollow}
          disabled={loading}
        >
          {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default SearchUserCard;
