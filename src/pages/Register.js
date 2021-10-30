import React, { useState } from "react";
import Axios from "axios";

import "../App.css";

function Register() {
  const username = useFormInput("");
  const email = useFormInput("");
  const password = useFormInput("");
  const passwordConfirmation = useFormInput("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const submitRegistration = () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    Axios.post("http://localhost:3008/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    })
      .then((response) => {
        setLoading(false);
        setSuccess(response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401)
          setError(error.response.data.message);
        else setError("Something went wrong!");
      });
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Register</h5>
          <form>
            <div className="mb-3">
              <label for="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                {...username}
              />
            </div>
            <div className="mb-3">
              <label for="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                {...email}
                autoComplete="new-password"
              />
            </div>
            <div className="mb-3">
              <label for="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                {...password}
                autoComplete="new-password"
              />
            </div>
            <div className="mb-3">
              <label for="passwordConfirmation" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                name="passwordConfirmation"
                {...passwordConfirmation}
                autoComplete="new-password"
              />
            </div>
            {error && (
              <>
                <small className="alert alert-warning">{error}</small>
                <br />
              </>
            )}
            {success && (
              <>
                <small className="alert alert-success">{success}</small>
                <br />
              </>
            )}
            <br />
            <input
              type="button"
              className="btn btn-primary"
              value={loading ? "Loading" : "Register"}
              onClick={submitRegistration}
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
export default Register;
