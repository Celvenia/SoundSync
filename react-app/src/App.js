import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate, login } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import MusicPlayer from "./components/MusicPlayer";
import SideBar from "./components/SideBar";
// import SearchPage from "./components/SearchPage";
// import { getSongs } from "./store/songs";
// import { getPlaylists } from "./store/playlists";
// import { fetchAccessToken } from "./store/spotify";
// import SpotifyWebApi from "spotify-web-api-js";

// import Search from "./components/Search";
import Card from "./components/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import LoginFormModal from "./components/LoginFormModal";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Socials from "./components/Socials";
import Test from "./components/Test"
import { MusicProvider } from "./context/MusicContext";

// const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const accessToken = useSelector((state) => state.tokenReducer.access_token)

  useEffect(() => {
    if (!accessToken) return;
  }, [dispatch, accessToken]);

  // useEffect(() => {
  //   dispatch(authenticate()).then(() => setIsLoaded(true));
  // }, [dispatch]);


  return (
    <MusicProvider>
      <div className="outerWrap">
        <Navigation isLoaded={isLoaded} />
        <div className="App">
          <SideBar/>
          <div className="main">

            <div className="mainContent">
              <Switch>
                <Route path="/">
                  <Dashboard />
                  {/* <LoginFormModal /> */}
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="musicPlayer">
        {accessToken && <MusicPlayer accessToken={accessToken} />}
      </div> */}
    </MusicProvider>
  );
}

export default App;
