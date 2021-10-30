import React, { useState } from "react";
import Axios from "axios";

import "../App.css";

function CreateTransaction() {
  const [loading, setLoading] = useState(false);
  const user = sessionStorage.getItem("user");
  console.log(user);
  const [description, setDescription] = useState("");
  const amount = useFormInput("");
  const type = useFormInput("");
  const category = useFormInput("");
  const date = useFormInput("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const submitTransaction = () => {
    setLoading(true);
    Axios.post("http://localhost:3008/api/create", {
      description: description,
      amount: Number(amount.value),
      type: type.value,
      category: category.value,
      date: date.value,
      userId: user,
    })
      .then((response) => {
        setLoading(false);
        setSuccess(response.data.message);
        console.log("User is" + user);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Log Transaction</h5>
          <form>
            <div className="mb-3">
              <label for="description" className="form-label">
                Description
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label for="amount" className="form-label">
                Amount
              </label>
              <input
                type="number"
                className="form-control"
                id="amount"
                name="amount"
                {...amount}
              />
            </div>
            <div className="mb-3">
              <select className="form-select" aria-label="type" {...type}>
                <option disabled={true}>Select Transaction Type</option>
                <option value="inc">Income</option>
                <option value="exp">Expense</option>
              </select>
            </div>
            <div className="mb-3">
              <label for="category" className="form-label">
                Category
              </label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="category"
                {...category}
              />
            </div>
            <div className="mb-3">
              <label for="description" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                {...date}
              />
            </div>
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
              value={loading ? "Loading..." : "Submit Transaction"}
              onClick={submitTransaction}
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

export default CreateTransaction;
