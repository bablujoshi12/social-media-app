import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const inputValue = e.target.value;

    setloginInfo((currVal) => {
      return {
        ...currVal,
        [fieldName]: inputValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { email, password } = loginInfo;

    if (!email || !password) {
      return toast.error("All field required");
    }

    const url = "http://localhost:8080/login";

    try {
      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();

      let { success, message, token, username } = result;

      if (success) {
        toast.success(message);
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", username);
        setTimeout(() => {
          navigate("/home");
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
              <h2 className="text-center fw-bold mb-2">Welcome Back</h2>

              <p className="text-center text-muted mb-4">
                Login to your account
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    value={loginInfo.email}
                    onChange={handleChange}
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
                    value={loginInfo.password}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100">
                  Login
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                Don't have an account?{" "}
                <Link to="/signup" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
