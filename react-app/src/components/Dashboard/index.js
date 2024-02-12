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
import { deletePlaylistTrack, getPlaylists, postPlaylistTrack } from "../../store/playlist";
import { getLyrics } from "../../store/lyrics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { deletePlaylistTracks } from "../../store/spotifyPlaylists";

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
  const [playingTrack, setPlayingTrack] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [queuedPlaylist, setQueuedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { playingTrackUri, setTrackUri } = useMusic();

  

  const chooseTrack = async (track) => {
    setLoading(true); 
    setSearch("");
    setLyrics("");
    await dispatch(getLyrics(track.artist, track.title))
    setPlayingTrack(track);
    setLoading(false); 
  };

  const handleAddSong = async (playlistId, trackData) => {
    const playlistItems = playlistsObj[playlistId].items;

    const matchingItem = playlistItems.find((item) => (
      item.artist === trackData.artist &&
      item.title === trackData.title &&
      item.uri === trackData.uri &&
      item.album_url === trackData.albumUrl
    ));

    if (!matchingItem) {
      await dispatch(postPlaylistTrack(playlistId, trackData))

    } else {
      console.warn("Duplicate playlist item found");
    }
  
   
    return;
  }

  const handleRemoveSong = async (playlistId, trackData) => {
    const playlistItems = playlistsObj[playlistId].items;

    const matchingItem = playlistItems.find((item) => (
      item.artist === trackData.artist &&
      item.title === trackData.title &&
      item.uri === trackData.uri &&
      item.album_url === trackData.albumUrl
    ));
  
    if (matchingItem) {

      await dispatch(deletePlaylistTrack(playlistId, matchingItem.id));

    } else {
      console.warn("No matching playlist item found");
    }
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
      dispatch(getPlaylists())
    }
    
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

  const handlePlaylistSelect = (e) => {
    const selectedPlaylistId = parseInt(e.target.value, 10);
    const playlist = playlists.find((p) => p.id === selectedPlaylistId);
    setSelectedPlaylist(playlist);
  };

  const handlePlaylistQueue = (e) => {
    const selectedPlaylistId = parseInt(e.target.value, 10);
    const playlist = playlists.find((p) => p.id === selectedPlaylistId);
    setQueuedPlaylist(playlist);

  };

  useEffect(() => {
    if (!lyricsObj.lyrics) return;
    setLyrics(lyricsObj.lyrics);
    return;
  }, [lyricsObj.lyrics, playingTrack]);

// console.log(playingTrack)

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
        <select onChange={handlePlaylistSelect}>
            <option value={null}>Select Playlist To Edit</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.title}
              </option>
            ))}
          </select>
        )}

{playlists.length > 0 && (
        <select onChange={handlePlaylistQueue}>
            <option value={null}>Queue Playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.title}
              </option>
            ))}
          </select>
        )}
      {selectedPlaylist && playlists.length > 0 && playlistsObj[selectedPlaylist.id] && (
        <div className="selected-playlist-container">
          <h4>Selected Playlist: <p> { playlistsObj[selectedPlaylist.id].title}
            </p> 
            </h4>
          {lyrics !== "" && playingTrack.title && (
            <>
            <p>Last Searched: 
              <p>
              {playingTrack.title} by {playingTrack.artist}
              </p>
              </p>
              <div className="selected-playlist-button-container">
            <button onClick={() => handleAddSong(selectedPlaylist.id, playingTrack)}>Add Searched To Playlist</button>
            <button onClick={() => handleRemoveSong(selectedPlaylist.id, playingTrack)}>Remove Searched From Playlist</button>
            </div>
            </>
            )}
        </div>
      )}
      
      <div className="card-wrap">
        {!loading && searchResults.map((result) => (
          <Card data={result} key={result.uri} chooseTrack={chooseTrack} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={setSelectedPlaylist} loading={loading}/>
        ))}
      </div>

      {queuedPlaylist && (
  <div>
    <h5>{playlistsObj[queuedPlaylist.id].title}</h5>
    {playlistsObj[queuedPlaylist.id].items.map((item, i) => (
      <div key={i + 1}>
        {i + 1}: {item.title} by {item.artist}
      </div>
    ))}
  </div>
)}

      {lyrics && searchResults.length <= 0 && !loading && !queuedPlaylist && (
        <div>
          {lyrics.split(/(\[.*?\])/).map((section, index) => (
            section.trim() && <div key={index}>{section}</div>
          ))}
        </div>
      )}
      {loading && !queuedPlaylist && (
        <div>Loading Lyrics</div>
      )}
      <div className="musicPlayer">
        {accessToken && (
          <MusicPlayer accessToken={accessToken} trackUri={playingTrack?.uri} queuedPlaylist={queuedPlaylist}/>
        )}
      </div>
    </div>
  ) : (
    <LoginFormModal />
  );
}
