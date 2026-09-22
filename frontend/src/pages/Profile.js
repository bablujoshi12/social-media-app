import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [editingProfile, setEditingProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${userId}`,
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

        setUser(result.user);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const getUserPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/posts/user/${userId}`,
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

        setPosts(result.posts);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getUserProfile();
    getUserPosts();
  }, [userId, token]);

  // Check Follow
  const isFollowing = user?.followers?.some(
    (followerId) => followerId.toString() === currentUser._id.toString(),
  );

  // Delete Post
  const handleDelete = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId),
    );
  };

  // Update Post
  const handleUpdated = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  };

  // Follow / Unfollow
  const handleFollow = async () => {
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

      const profileResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          method: "GET",
          headers: {
            authorization: token,
          },
        },
      );

      const profileResult = await profileResponse.json();

      if (profileResponse.ok) {
        setUser(profileResult.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Like / Unlike
  const handleLike = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  };

  // Select Profile Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
  };

  // Update Profile Image
  const handleProfileImage = async () => {
    if (!selectedImage) {
      return toast.error("Please select an image");
    }

    try {
      const formData = new FormData();

      formData.append("profileImage", selectedImage);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/profile/image`,
        {
          method: "PUT",
          headers: {
            authorization: token,
          },
          body: formData,
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

      setUser(result.user);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Open Edit Profile
  const handleEditProfile = () => {
    setUsername(user.username || "");
    setBio(user.bio || "");
    setEditingProfile(true);
  };

  // Cancel Edit Profile
  const handleCancelEdit = () => {
    setEditingProfile(false);
    setSelectedImage(null);
    setUsername("");
    setBio("");
  };

  // Update Username + Bio
  const handleUpdateProfile = async () => {
    try {
      if (!username.trim()) {
        return toast.error("Username is required");
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
        method: "PUT",
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bio,
        }),
      });

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

      setUser(result.user);
      setEditingProfile(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const isOwnProfile = currentUser._id.toString() === user._id.toString();

  const profileImage = user.profileImage?.startsWith("http")
    ? user.profileImage
    : `${process.env.REACT_APP_API_URL}/${user.profileImage}`;

  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light min-vh-100 py-3 py-md-4">
        <div className="container">
          {/* Back Button */}
          <button
            className="btn btn-outline-secondary btn-sm mb-3"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left me-2"></i>
            Back
          </button>

          {/* Profile Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3 p-sm-4 p-lg-5">
              <div className="row align-items-center">
                {/* Profile Image */}
                <div className="col-12 col-md-4 col-lg-3 text-center mb-4 mb-md-0">
                  <div
                    className="rounded-circle overflow-hidden mx-auto shadow-sm"
                    style={{
                      width: "clamp(105px, 22vw, 140px)",
                      height: "clamp(105px, 22vw, 140px)",
                    }}
                  >
                    <img
                      src={profileImage}
                      alt={user.username}
                      className="w-100 h-100"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="col-12 col-md-8 col-lg-9">
                  {/* Username + Button */}
                  <div className="d-flex flex-column flex-sm-row align-items-center align-items-md-start gap-2 gap-sm-3 mb-3">
                    <h3 className="fw-bold mb-0 text-break text-center text-sm-start">
                      {user.username}
                    </h3>

                    {/* Own Profile */}
                    {isOwnProfile && (
                      <button
                        className="btn btn-outline-primary btn-sm px-3 flex-shrink-0"
                        onClick={handleEditProfile}
                      >
                        <i className="fa-solid fa-pen me-1"></i>
                        Edit Profile
                      </button>
                    )}

                    {/* Other User Profile */}
                    {!isOwnProfile && (
                      <button
                        className={`btn btn-sm px-4 flex-shrink-0 ${
                          isFollowing ? "btn-outline-secondary" : "btn-primary"
                        }`}
                        onClick={handleFollow}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>

                  {/* Edit Profile Form */}
                  {editingProfile && isOwnProfile && (
                    <div className="card bg-light border-0 mb-4">
                      <div className="card-body p-3 p-sm-4">
                        <h6 className="fw-bold mb-3">Edit Profile</h6>

                        {/* Profile Image */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Profile Image
                          </label>

                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageChange}
                          />

                          {selectedImage && (
                            <button
                              className="btn btn-primary btn-sm mt-2"
                              onClick={handleProfileImage}
                            >
                              <i className="fa-solid fa-upload me-1"></i>
                              Update Image
                            </button>
                          )}
                        </div>

                        {/* Username */}
                        <div className="mb-3">
                          <label className="form-label">Username</label>

                          <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>

                        {/* Bio */}
                        <div className="mb-3">
                          <label className="form-label">Bio</label>

                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Write something about yourself..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex flex-column flex-sm-row gap-2">
                          <button
                            className="btn btn-primary"
                            onClick={handleUpdateProfile}
                          >
                            Save Changes
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2 gap-sm-3 mb-3">
                    {/* Posts */}
                    <div className="d-flex align-items-center px-3 py-2 border rounded-pill bg-light text-nowrap">
                      <strong>{posts.length}</strong>

                      <span className="text-muted ms-1">Posts</span>
                    </div>

                    {/* Followers */}
                    <button
                      className="btn btn-outline-secondary rounded-pill px-3 py-2 text-nowrap"
                      onClick={() => navigate(`/profile/${userId}/followers`)}
                    >
                      <strong>{user.followers?.length || 0}</strong>

                      <span className="ms-1">Followers</span>
                    </button>

                    {/* Following */}
                    <button
                      className="btn btn-outline-secondary rounded-pill px-3 py-2 text-nowrap"
                      onClick={() => navigate(`/profile/${userId}/following`)}
                    >
                      <strong>{user.following?.length || 0}</strong>

                      <span className="ms-1">Following</span>
                    </button>
                  </div>

                  {/* Bio */}
                  <p className="text-muted mb-0 text-center text-md-start text-break">
                    {user.bio || "No bio available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="card border-0 shadow-sm mt-3 mt-md-4">
            <div className="card-body p-3 p-sm-4">
              <h5 className="fw-bold mb-3 mb-md-4">Posts</h5>

              {posts.length === 0 ? (
                <div className="text-center py-4 py-md-5">
                  <i className="fa-regular fa-image fs-2 text-muted mb-3"></i>

                  <p className="text-muted mb-0">No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onUpdated={handleUpdated}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
