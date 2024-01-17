import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
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
import { MusicProvider } from "./context/MusicContext";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);

  const [spotifyToken, setSpotifyToken] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const songs = [];

  const data = [
    { name: "A", value: 1 },
    { name: "B", value: 2 },
    { name: "C", value: 3 },
  ];

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
    if (!accessToken) return;
  }, [dispatch, accessToken]);

  return (
    <MusicProvider>
      <div className="outerWrap">
        <div className="App">
          <SideBar data={data} />
          <div className="main">
            {/* <Navigation isLoaded={isLoaded} /> */}
            <Profile />
            <div className="mainContent">
              {isLoaded && (
                <Switch>
                  <Route path="/search">
                    {code ? <Dashboard code={code} /> : <LoginFormModal />}
                  </Route>
                  <Route path="/">
                    {code ? <Dashboard code={code} /> : <LoginFormModal />}
                  </Route>
                </Switch>
              )}
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
