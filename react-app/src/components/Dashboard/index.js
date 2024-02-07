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

import { signUp, login } from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import { getPlaylists } from "../../store/playlist";
import { getLyrics } from "../../store/lyrics";

const spotifyApi = new SpotifyWebApi({
  clientId: "442c0305787a40a8a9c36fc4270e17c7",
});

export default function Dashboard({ code }) {
  const token = UseAuth(code);
  const accessToken = useSelector((state) => state.spotifyReducer.accessToken);
  const userInfo = useSelector((state) => state.spotifyReducer);
  const lyricsObj = useSelector((state) => state.lyricsReducer);
  const playlistsObj = useSelector((state) => state.playlistReducer);
  const playlists = Object.values(playlistsObj)
  const sessionUser = useSelector((state) => state.session.user);
  const [search, setSearch] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { playingTrackUri, setTrackUri } = useMusic();

  

  const chooseTrack = async (track) => {
    setLoading(true); 
    setSearch("");
    setLyrics("");
    await dispatch(getLyrics(track.artist, track.title))
    setPlayingTrack(track);
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    setLoading(false); 
  };

  useEffect(() => {
    if (!playingTrack) return;
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    dispatch(getUserInfo(accessToken));
    if (userInfo.email) {
      dispatch(login(userInfo));
    }
    dispatch(getPlaylists()).then(() => {
      if (playlists.length > 0) {
        setSelectedPlaylist(playlists[0]);
      } else if (playlists.length === 0 ) {
        setSelectedPlaylist(null)
      }
    });
  }, [accessToken, userInfo.email, dispatch]);

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

  const handlePlaylistChange = (e) => {
    const selectedPlaylistId = parseInt(e.target.value, 10);
    const playlist = playlists.find((p) => p.id === selectedPlaylistId);
    setSelectedPlaylist(playlist);
    setPlaylistTracks([]);
  };

  useEffect(() => {
    if (!lyricsObj.lyrics) return;
    setLyrics(lyricsObj.lyrics);
    return;
  }, [lyricsObj.lyrics, playingTrack]);

 

  return sessionUser ? (
    <div>

        <div className="search-bar">
        <input
          type="text"
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />  
          </div>
      
      {playlists.length > 0 && (
        <select onChange={handlePlaylistChange}>
            <option value={null}>Select Playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.title}
              </option>
            ))}
          </select>
        )}
      {selectedPlaylist && playlists.length > 0 && (
        <div>
          <h4>Selected Playlist: {selectedPlaylist.title}</h4>
        </div>
      )}
      <div className="card-wrap">
        {!loading && searchResults.map((result) => (
          <Card data={result} key={result.uri} chooseTrack={chooseTrack} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist} loading={loading}/>
        ))}
      </div>
      {lyrics && searchResults.length <= 0 && !loading && (
        <div>
          {lyrics.split(/(\[.*?\])/).map((section, index) => (
            section.trim() && <div key={index}>{section}</div>
          ))}
        </div>
      )}
      {loading && (
        <div>Loading Lyrics</div>
      )}
      <div className="musicPlayer">
        {accessToken && (
          <MusicPlayer accessToken={accessToken} trackUri={playingTrack?.uri} playlistTracks={playlistTracks} onTrackChange={(track) => chooseTrack(track)}/>
        )}
      </div>
    </div>
  ) : (
    <LoginFormModal />
  );
}
