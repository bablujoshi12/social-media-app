import React, { useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import EditPost from "./EditPost";

function PostCard({ post, onLike, onDelete, onUpdated }) {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);

  // Handle populated + unpopulated likes
  const isLiked = post.likes?.some((like) => {
    const likeId = like?._id || like;

    return likeId?.toString() === currentUser._id.toString();
  });

  // Handle populated + unpopulated author
  const authorId = post.author?._id || post.author;

  const isOwner = authorId?.toString() === currentUser._id.toString();

  const handleLike = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
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

      onLike(result.post);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: localStorage.getItem("token"),
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

      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdated = (updatedPost) => {
    if (onUpdated) {
      onUpdated(updatedPost);
    }

    setEditing(false);
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      {/* Post Header */}
      <div className="card-body pb-2">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Profile Image */}
            <div
              className="rounded-circle overflow-hidden flex-shrink-0"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <img
                src={post.author?.profileImage}
                alt={post.author?.username || "User"}
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            <div>
              <h6 className="mb-0 fw-bold">
                {post.author?.username || "Unknown User"}
              </h6>

              <small className="text-muted">{post.createdAt}</small>
            </div>
          </div>

          {/* More */}
          {isOwner && (
            <div className="dropdown">
              <button className="btn btn-light" data-bs-toggle="dropdown">
                <i className="fa-solid fa-ellipsis"></i>
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                {/* Edit */}
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setEditing(true)}
                  >
                    <i className="fa-solid fa-pen me-2"></i>
                    Edit
                  </button>
                </li>

                {/* Delete */}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleDelete}
                  >
                    <i className="fa-solid fa-trash me-2"></i>
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Caption */}
        <p className="mt-3 mb-3">{post.caption}</p>
      </div>

      {/* Post Image */}
      <div
        className="w-100 bg-light d-flex justify-content-center"
        style={{
          maxHeight: "600px",
          overflow: "hidden",
        }}
      >
        <img
          src={post.image}
          alt={post.caption}
          className="img-fluid"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Edit Post */}
      {editing && (
        <div className="px-3 pb-3">
          <EditPost
            post={post}
            onUpdated={handleUpdated}
            onClose={() => setEditing(false)}
          />
        </div>
      )}

      {/* Actions */}
      <div className="card-body">
        <div className="d-flex gap-2">
          {/* Like */}
          <button onClick={handleLike} className="btn btn-light">
            <i
              className={`fa-heart me-1 ${
                isLiked ? "fa-solid text-danger" : "fa-regular"
              }`}
            ></i>
            Like
          </button>

          {/* Comment */}
          <button
            className="btn btn-light"
            onClick={() => navigate(`/posts/${post._id}/comments`)}
          >
            <i className="fa-regular fa-comment me-1"></i>
            Comment
          </button>

          {/* Share */}
          <button className="btn btn-light">
            <i className="fa-solid fa-share me-1"></i>
            Share
          </button>
        </div>

        {/* Likes */}
        <div className="mt-3">
          <strong>{post.likes?.length || 0} likes</strong>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
