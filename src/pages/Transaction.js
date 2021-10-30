import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "../App.css";

export default function Post() {
  let { id } = useParams();
  const [transaction, setTransaction] = useState({});
  const [title, setTitle] = useState("");

  useEffect(() => {
    Axios.get(`http://localhost:3008/api/getFromId?id=${id}`).then((data) => {
      console.log(data);
      setTransaction({
        description: data.data[0].description,
        amount: data.data[0].amount,
        type: data.data[0].type,
        category: data.data[0].category,
        date: data.data[0].date,
        id: data.data[0].id,
      });
    });
  }, [id]);

  const deleteTransaction = (id) => {
    Axios.delete(`http://localhost:3008/api/delete/${id}`).then((response) => {
      alert("you deleted a Transaction");
    });
  };

  return (
    <div className="card">
      <h3>{transaction.description}</h3>
      <h4>{transaction.category}</h4>
      <h4>{transaction.amount}</h4>
      <p>{transaction.date}</p>
      <button onClick={() => deleteTransaction(transaction.id)}>
        Delete transaction
      </button>
    </div>
  );
}
