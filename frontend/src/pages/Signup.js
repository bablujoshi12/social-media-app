import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Signup() {
  const [signupInfo, setsignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const inputValue = e.target.value;

    setsignupInfo((currVal) => {
      return {
        ...currVal,
        [fieldName]: inputValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { username, email, password } = signupInfo;

    if (!username || !email || !password) {
      return toast.error("All field required");
    }

    const url = "http://localhost:8080/signup";

    try {
      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      console.log(result);

      let { success, message } = result;

      if (success) {
        toast.success(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        return toast.error(message);
      }
    } catch (err) {
      return toast.error(err.message);
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center fw-bold mb-2">Signup</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg "
                    placeholder="Enter your username"
                    name="username"
                    id="username"
                    onChange={handleChange}
                    value={signupInfo.username}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    value={signupInfo.email}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    name="password"
                    id="password"
                    onChange={handleChange}
                    value={signupInfo.password}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Signup
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                you have already account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
