import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Comments() {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  // Get comments
  const getComments = async () => {
    try {
      const url = `http://localhost:8080/posts/${postId}/comments`;

      const response = await fetch(url, {
        method: "GET",
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

      // No comments is not treated as an error
      if (response.status === 404) {
        setComments([]);
        return;
      }

      if (!response.ok) {
        return toast.error(result.message);
      }

      setComments(result.comments);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  // Get logged-in user profile
  const getProfile = async () => {
    try {
      const url = `http://localhost:8080/profile`;

      const response = await fetch(url, {
        method: "GET",
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

      setUser(result.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Input change
  const handleChange = (e) => {
    setText(e.target.value);
  };

  // Create comment
  const createComments = async () => {
    try {
      if (!text.trim()) {
        return toast.error("Comment cannot be empty");
      }

      const url = `http://localhost:8080/posts/${postId}/comments`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      const { message, success } = result;

      if (response.status === 401) {
        toast.error(message);

        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

        return;
      }

      if (!response.ok) {
        return toast.error(message);
      }

      if (success) {
        toast.success(message);

        // Add current user's profile information
        // because backend response may not contain populated author
        const newComment = {
          ...result.comment,
          author: user,
        };

        setComments((currVal) => [...currVal, newComment]);

        setText("");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      const url = `http://localhost:8080/posts/comments/${commentId}`;

      const response = await fetch(url, {
        method: "DELETE",
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

      toast.success(result.message);

      setComments((currVal) =>
        currVal.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm mt-4">
                {/* Header */}
                <div className="card-header bg-white border-0 py-3">
                  <div className="d-flex align-items-center gap-3">
                    <button
                      className="btn btn-light rounded-circle"
                      onClick={() => navigate(-1)}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>

                    <h5 className="fw-bold mb-0">Comments</h5>
                  </div>
                </div>

                <div className="card-body">
                  {/* Comments */}
                  {comments.length === 0 ? (
                    <p className="text-center text-muted my-4">
                      No comments yet
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div className="d-flex gap-2 mb-4" key={comment._id}>
                        {/* Profile Image */}
                        <div
                          className="rounded-circle overflow-hidden flex-shrink-0"
                          style={{
                            width: "45px",
                            height: "45px",
                          }}
                        >
                          <img
                            src={comment.author.profileImage}
                            alt={comment.author.username}
                            className="w-100 h-100"
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Comment Content */}
                        <div className="flex-grow-1">
                          <div className="bg-light rounded-3 px-3 py-2">
                            <small className="fw-bold d-block">
                              {comment.author.username}
                            </small>

                            <span>{comment.text}</span>
                          </div>

                          <div className="mt-1 d-flex gap-3 align-items-center">
                            <small className="text-muted">
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>

                            {/* Delete only own comment */}
                            {user?._id === comment.author?._id && (
                              <button
                                className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
                                onClick={() => deleteComment(comment._id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Comment */}
                  <div className="d-flex gap-2 align-items-center mt-3">
                    {/* Current User Image */}
                    <div
                      className="rounded-circle overflow-hidden flex-shrink-0"
                      style={{
                        width: "45px",
                        height: "45px",
                      }}
                    >
                      {user && (
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>

                    {/* Input */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write a comment..."
                      name="text"
                      value={text}
                      onChange={handleChange}
                    />

                    {/* Post Button */}
                    <button
                      className="btn btn-primary"
                      onClick={createComments}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comments;
