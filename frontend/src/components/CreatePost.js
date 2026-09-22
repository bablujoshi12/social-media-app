import React, { useState } from "react";
import { toast } from "react-toastify";

function CreatePost({ onPostCreated }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!image) {
      return toast.error("Please select an image");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: "POST",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);

      setCaption("");
      setImage(null);

      document.getElementById("postImage").value = "";

      if (onPostCreated) {
        onPostCreated(result.post);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">Create Post</h5>

        <form onSubmit={handleCreatePost}>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            id="postImage"
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
