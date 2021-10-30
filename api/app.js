const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const utils = require("./utils");
const mysql = require("mysql");
const { promisify } = require("util");
const port = process.env.PORT || 3008;

// Env configuration
dotenv.config({ path: "./.env" });

// Create connection to DB and connect
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Db conected");
  }
});

// enable CORS
app.use(cors());
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["authorization"];
  if (!token) return next(); //if no token, continue

  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

// request handlers
app.get("/", (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid user to access it." });
  res.send(`${req.user.email} is logged into API`);
});

// Login
app.post("/users/signin", async (req, res) => {
  const { email, password } = req.body;

  // return 400 status if username/password is not exist
  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required.",
    });
  }
  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (error, results) => {
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).json({
          error: true,
          message: "Incorrect email and or password",
        });
      } else {
        const id = results[0].user_id;
        // Token(jwt) set up:
        // Send id to be encoded with JWT
        const token = utils.generateToken(id);
        const userObj = id;
        return res.json({ user: userObj, token });
      }
    }
  );
});

// verify the token and return it if it's valid
app.get("/verifytoken", async (req, res, next) => {
  const token = req.body.token || req.query.token;
  if (token) {
    try {
      // Verify Token. Decode and get back the id
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // Check if user still exists in database.
      db.query(
        "SELECT * FROM user WHERE user_id = ?",
        [decoded.id],
        (error, results) => {
          if (!results) {
            return res.status(401).json({
              error: true,
              message: "Invalid user.",
            });
          }
          // Create variable user.
          const userObj = utils.getCleanUser(decoded.id);
          return res.json({ user: userObj, token });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: true,
        message: "Invalid token.",
      });
    }
  } else {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }
});

// Routes for db manipulation
app.use("/api", require("./routes/pages"));
// Routes for authentication
// app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log("Server started on: " + port);
});
