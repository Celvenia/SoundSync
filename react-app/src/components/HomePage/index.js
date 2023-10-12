import React from "react";
import { Route, Switch } from "react-router-dom";
import "./HomePage.css";
// import Sidebar from "../Sidebar";

export default function HomePage() {
  return (
    <div className="main-body">
      <Switch>
        <Route path="/">
          {/* <Sidebar /> */}
          {/* <Library /> */}
        </Route>
        {/* <Route path="/feed">
          <Feed />
        </Route>
        <Route path="/trending">
          <Trending />
        </Route>
        <Route path="/player">
          <Player />
        </Route>
        <Route path="/favorites">
          <Favorites />
        </Route> */}
      </Switch>
    </div>
  );
}
