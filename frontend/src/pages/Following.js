import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Following() {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${userId}/following`,
          {
            method: "GET",
            headers: {
              authorization: localStorage.getItem("token"),
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          return toast.error(result.message);
        }

        setFollowing(result.following);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getFollowing();
  }, [userId]);

  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  {/* Back Button */}
                  <button
                    className="btn btn-outline-secondary btn-sm mb-3"
                    onClick={() => navigate(-1)}
                  >
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Back
                  </button>

                  <h4 className="fw-bold mb-4">Following</h4>

                  {following.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa-solid fa-user-plus fs-2 text-muted mb-3"></i>

                      <p className="text-muted mb-0">
                        Not following anyone yet
                      </p>
                    </div>
                  ) : (
                    following.map((user) => (
                      <div
                        key={user._id}
                        className="d-flex justify-content-between align-items-center py-3 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle overflow-hidden flex-shrink-0"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <img
                              src={user.profileImage}
                              alt={user.username}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          <div>
                            <h6 className="fw-bold mb-1">{user.username}</h6>

                            <small className="text-muted">
                              @{user.username}
                            </small>
                          </div>
                        </div>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => navigate(`/profile/${user._id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Following;
