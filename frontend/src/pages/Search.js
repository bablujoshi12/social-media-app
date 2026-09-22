import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import SearchUserCard from "../components/SearchUserCard";

function Search() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (!search.trim()) {
        return toast.error("Please enter username");
      }

      const url = `http://localhost:8080/users/search/username?username=${encodeURIComponent(
        search,
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setUsers([]);
        return toast.error(result.message);
      }

      setUsers(result.users);
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
              {/* Back Button */}
              <div className="mt-4">
                <button
                  className="btn btn-light shadow-sm"
                  onClick={() => navigate(-1)}
                >
                  <i className="fa-solid fa-arrow-left me-2"></i>
                  Back
                </button>
              </div>

              {/* Search Card */}
              <div className="card border-0 shadow-sm mt-3">
                <div className="card-body">
                  <h4 className="fw-bold mb-1">Search</h4>

                  <p className="text-muted mb-4">
                    Find people and connect with them
                  </p>

                  {/* Search Box */}
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="fa-solid fa-magnifying-glass text-muted"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by username..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                      className="btn btn-primary px-4"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">People</h6>

                    <small className="text-muted">{users.length} results</small>
                  </div>

                  {/* No Results */}
                  {users.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa-solid fa-user-slash fs-2 text-muted mb-3"></i>

                      <p className="text-muted mb-0">No users found</p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <SearchUserCard key={user._id} user={user} />
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

export default Search;
