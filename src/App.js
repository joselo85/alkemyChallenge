import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import axios from "axios";

import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { getToken, removeUserSession, setUserSession } from "./utils/Common";

import CreateTransaction from "./pages/CreateTransaction";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import Transaction from "./pages/Transaction";
function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }

    axios
      .get(`http://localhost:3008/verifyToken?token=${token}`)
      .then((response) => {
        setUserSession(response.data.token, response.data.user);
        setAuthLoading(false);
      })
      .catch((error) => {
        removeUserSession();
        setAuthLoading(false);
      });
  }, []);

  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="header">
            <NavLink activeClassName="active" to="/register">
              Register
            </NavLink>
            <NavLink activeClassName="active" to="/login">
              Login
            </NavLink>
            <NavLink exact activeClassName="active" to="/mainpage">
              Home
            </NavLink>
            <NavLink exact activeClassName="active" to="/createtransaction">
              Create Transaction
            </NavLink>
            <small>(Access without token only)</small>
          </div>
          <div className="content">
            <Switch>
              <PublicRoute path="/register" component={Register} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute
                path="/createtransaction"
                component={CreateTransaction}
              />
              <PrivateRoute path="/mainpage" component={MainPage} />
              <PrivateRoute path="/transaction" component={Transaction} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
