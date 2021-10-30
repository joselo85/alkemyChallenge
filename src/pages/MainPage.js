import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import "../App.css";

function MainPage() {
  const [postList, setPostList] = useState([]);
  const [balance, setBalance] = useState("");
  const user = sessionStorage.getItem("user");
  console.log(user);
  let history = useHistory();

  useEffect(() => {
    Axios.get(`http://localhost:3008/api/get?userId=${user}`).then(
      (response) => {
        console.log(response.data.result);
        setPostList(response.data.result);
        setBalance(response.data.balance);
      }
    );
  }, []);

  return (
    <div className="container mt-4">
      <div className="card">
        <h4>Your Current Balance is ${balance}</h4>
        <ul className="list-group list-group-flush">
          {postList.map((val, key) => {
            return (
              <li className="list-group-item d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div
                    className="card-header"
                    onClick={() =>
                      history.push(`/transaction/${val.idtransaction}`)
                    }
                  >
                    {val.description}
                  </div>
                  {val.category} Date: {val.date} Transaction id:{" "}
                  {val.idtransaction}
                  <span
                    className={
                      val.type === "exp"
                        ? "badge bg-danger rounded-pill"
                        : "badge bg-success rounded-pill"
                    }
                  >
                    ${val.amount}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
