import React, { useState } from "react";
import { toast } from "react-toastify";

function EditPost({ post, onUpdated, onClose }) {
  const [caption, setCaption] = useState(post.caption || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("caption", caption);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${post._id}`,
        {
          method: "PUT",
          headers: {
            authorization: localStorage.getItem("token"),
          },
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        return toast.error(result.message);
      }

      toast.success(result.message);

      if (onUpdated) {
        onUpdated(result.post);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border mt-3">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Edit Post</h6>

        <form onSubmit={handleUpdate}>
          <textarea
            className="form-control mb-3"
            rows="3"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="btn btn-primary me-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
