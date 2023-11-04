import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
// import MusicPlayer from "./components/MusicPlayer";
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

// const getTokenFromUrl = () => {
//   return window.location.search
//     .substring(1)
//     .split("&")
//     .reduce((initial, item) => {
//       let parts = item.split("=");
//       initial[parts[0]] = decodeURIComponent(parts[1]);
//       return initial;
//     }, {});
// };

// const spotifyApi = new SpotifyWebApi();

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);

  const [spotifyToken, setSpotifyToken] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  const songs = [];

  const data = [
    { name: "A", value: 1 },
    { name: "B", value: 2 },
    { name: "C", value: 3 },
  ];

  // useEffect(() => {
  //   let { code, state } = getTokenFromUrl();

  // console.log("spotify code", code, "state", state);

  // if (code) {
  //   setSpotifyToken(`${code}`);

  //   setLoggedIn(true);
  // history.push("/");
  //     dispatch(fetchAccessToken());
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   if (spotifyToken) {
  //     spotifyApi.setAccessToken(spotifyToken);
  //   }
  // }, [spotifyToken]);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
    // dispatch(getSongs());
    // dispatch(getPlaylists());
  }, [dispatch]);

  // const getNowPlaying = () => {
  //   spotifyApi.getMyCurrentPlaybackState().then((response) => {
  //     setNowPlaying({
  //       name: response.item.name,
  //       albumArt: response.item.album.images[0].url,
  //     });
  //   });
  // };

  return (
    <div className="outerWrap">
      <div className="App">
        <SideBar data={data} />
        <div className="main">
          <Navigation isLoaded={isLoaded} />
          <div className="mainContent">
            {isLoaded && (
              <Switch>
                <Route path="/login">
                  <LoginFormPage />
                </Route>
                <Route path="/signup">
                  <SignupFormPage />
                </Route>
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
  );
}

export default App;
