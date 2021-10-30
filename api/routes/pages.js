const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// Get all transactions. .
router.get("/get", (req, res) => {
  const userId = req.body.userId || req.query.userId;
  console.log(userId);

  db.query(
    "SELECT * FROM transaction  WHERE user_user_id =  ? ORDER BY date DESC",
    userId,
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        let balance = [];
        db.query(
          "SELECT balance FROM user WHERE user_id = ?",
          userId,
          (err, results) => {
            if (err) {
              console.log(err);
            }
            balance = results[0].balance;
            return res.status(200).json({ result: result, balance: balance });
          }
        );
      }
    }
  );
});

// Get one transaction.
router.get("/getFromId/", (req, res) => {
  const id = req.query.id;

  const userId = req.body.userId || req.query.userId;
  db.query(
    "SELECT * FROM transaction WHERE idtransaction = ?",
    id,
    (error, result) => {
      if (error) {
        console.log(error);
      }
      console.log(result[0]);
      res.status(200).send(result);
    }
  );
});

// Create Transaction
router.post("/create", (req, res) => {
  const description = req.body.description;
  const amount = Number(req.body.amount);
  const type = req.body.type;
  const category = req.body.category;
  const date = req.body.date;
  const userId = Number(req.body.userId);

  // If transaction is an expense
  if (type === "exp") {
    // Insert transaction into table
    db.query(
      "INSERT INTO transaction (description, amount, type, category, date, user_user_id) VALUES (?,?,?,?,?,?)",
      [description, amount, type, category, date, userId]
    );
    // Update user's balance
    let balance = [];
    let newBalance = [];
    db.query(
      "SELECT balance FROM user WHERE user_id = ?",
      userId,
      (err, result) => {
        if (err) {
          throw err;
        } else {
          setValue(result[0].balance);
        }
      }
    );
    function setValue(value) {
      balance = value;
      // Since amount is an expense it should subtract from the current balance.
      newBalance = balance - amount;
      db.query("UPDATE user SET balance = ?", [newBalance], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} Records updated`);
      });
    }
    //Send response
    res.status(201).json({
      success: true,
      message: "Transaction submited!",
    });
    // If transaction is an income
  } else {
    // Insert transaction into table.
    db.query(
      "INSERT INTO transaction (description, amount, type, category, date, user_user_id) VALUES (?,?,?,?,?,?)",
      [description, amount, type, category, date, userId],
      (err, result) => {
        if (err) throw err;
        console.log(
          `Description: ${description}, Amount: ${amount}, Type: ${type}, Category: ${category}, Date: ${date}, UserID: ${userId}`
        );
        console.log(`Number of rows inserted ${result.affectedRows}`);
      }
    );
    // Update User's balance
    let balance = [];
    let newBalance = [];
    db.query(
      "SELECT balance FROM user WHERE user_id = ?",
      userId,
      (err, result) => {
        if (err) {
          throw err;
        } else {
          setValue(result[0].balance);
        }
      }
    );
    function setValue(value) {
      balance = value;
      // Since amount is an income it should be added to the current balance.
      newBalance = balance + amount;
      db.query("UPDATE user SET balance = ?", [newBalance], (err, result) => {
        if (err) throw err;
        console.log(`${result.affectedRows} Records updated`);
      });
    }
    // Send response.
    res.status(201).json({
      success: true,
      message: "Transaction submited!",
    });
  }
});

//Delete Transaction:
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.user_id;

  db.query(
    "DELETE FROM transaction WHERE idtransaction = ? AND user_user_id = ?",
    [id, userId],
    (error, result) => {
      if (error) {
        console.log(error);
      }
    }
  );
});
module.exports = router;
