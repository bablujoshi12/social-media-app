import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileSuggestions from "../components/MobileSuggestions";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const stories = ["You", "Mansi", "Rahul", "Priya", "Aman", "Rohit"];

  const [feed, setFeed] = useState([]);

  const navigate = useNavigate();

  const getfeed = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/feed`;

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
        toast.error(result.message || "Failed to fetch feed");
        return;
      }

      setFeed(result.posts);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getfeed();
  }, []);

  // Like / Unlike
  const handleLike = (updatedPost) => {
    setFeed((currentFeed) =>
      currentFeed.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  };

  // Delete Post
  const handleDelete = (postId) => {
    setFeed((currentFeed) => currentFeed.filter((post) => post._id !== postId));
  };

  // Update Post
  const handleUpdated = (updatedPost) => {
    setFeed((currentFeed) =>
      currentFeed.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    );
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid bg-light min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Feed */}
            <div className="col-12 col-md-8 col-lg-6 col-xl-6">
              {/* Mobile + Tablet Suggestions */}
              <MobileSuggestions />

              {/* Stories */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Stories</h6>

                  <div className="d-flex gap-3 overflow-auto pb-2">
                    {stories.map((story, index) => (
                      <div key={index} className="text-center flex-shrink-0">
                        <div
                          className={`rounded-circle border border-3 ${
                            index === 0 ? "border-primary" : "border-secondary"
                          } p-1`}
                        >
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: "55px",
                              height: "55px",
                            }}
                          >
                            {story.charAt(0)}
                          </div>
                        </div>

                        <small className="d-block mt-1">{story}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Create Post */}
              <div id="create-post" className="mt-4">
                <CreatePost onPostCreated={getfeed} />
              </div>

              {/* Posts */}
              {feed.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>

            {/* Desktop Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
