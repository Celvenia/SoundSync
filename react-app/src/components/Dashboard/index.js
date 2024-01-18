import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SpotifyWebApi from "spotify-web-api-node";
import Card from "../Card";
import MusicPlayer from "../MusicPlayer";
import UseAuth from "../UseAuth";
import { getUserInfo } from "../../store/spotify";
import Playlists from "../Playlists";
import "./Dashboard.css";
import { useMusic } from "../../context/MusicContext";
import { getPlaylists, postPlaylist } from "../../store/playlist";
import { signUp } from "../../store/session";

const spotifyApi = new SpotifyWebApi({
  clientId: "442c0305787a40a8a9c36fc4270e17c7",
});

export default function Dashboard({ code }) {
  const token = UseAuth(code);
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const userInfo = useSelector((state) => state.spotifyReducer);
  const lyricsObj = useSelector((state) => state.lyricsReducer);
  const playlistsObj = useSelector((state) => state.playlistsReducer);
  const sessionUser = useSelector((state) => state.session.user);
  const [search, setSearch] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState([]);
  const dispatch = useDispatch();
  const { playingTrackUri, setTrackUri } = useMusic();

  const chooseTrack = async (track) => {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  };

  useEffect(() => {
    if (!lyricsObj.lyrics) return;
    setLyrics("");
    setLyrics(lyricsObj.lyrics);
    return () => {};
  }, [lyrics]);

  useEffect(() => {
    if (!playingTrack) return;
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    dispatch(getUserInfo(accessToken));
    if (userInfo) {
      dispatch(signUp(userInfo));
    }
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              return image.height < smallest.height ? image : smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => {
    if (!lyricsObj.lyrics) return;
    setLyrics(lyricsObj.lyrics);
    return;
  }, [lyricsObj.lyrics]);

  const handlePostPlaylistClick = () => {
    let data = { creator_id: sessionUser.id, title: "testing" };
    dispatch(postPlaylist(data));
  };

  console.log(playlistsObj);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handlePostPlaylistClick}>Post Playlists</button>
      </div>
      <div className="card-wrap">
        {searchResults.map((result) => (
          <Card data={result} key={result.uri} chooseTrack={chooseTrack} />
        ))}
      </div>
      {lyrics && <div> {lyrics} </div>}
      <div className="musicPlayer">
        {accessToken && (
          <MusicPlayer accessToken={accessToken} trackUri={playingTrack?.uri} />
        )}
      </div>
    </div>
  );
}
