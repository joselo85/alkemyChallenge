import React, { useState } from "react";
import Axios from "axios";
import { setUserSession } from "../utils/Common";
import { Route } from "react-router-dom";
import "../App.css";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const email = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    setLoading(true);
    Axios.post("http://localhost:3008/users/signin", {
      email: email.value,
      password: password.value,
    })
      .then((response) => {
        setLoading(false);
        console.log("loginin-----");
        console.log(response.data.token);
        console.log(response.data.user);

        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", response.data.user);
        props.history.push("/mainpage");
      })
      .catch((error) => {
        setLoading(false);
        if (error.status === 400 || error.status === 401) {
          setError(error.response.data.message);
          console.log(error);
        } else {
          setError("Something went wrong!");
          console.log(error);
        }
      });
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Login</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">
                Email address
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  {...email}
                  autoComplete="new-password"
                />
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">
                Password
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  {...password}
                />
              </label>
            </div>
            {error && (
              <>
                <small className="alert alert-warning">{error}</small>
                <br />
              </>
            )}
            <br />
            <input
              type="button"
              className="btn btn-primary"
              value={loading ? "Loading..." : "Login"}
              onClick={handleLogin}
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default Login;
