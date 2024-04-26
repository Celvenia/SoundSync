import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { getLyrics, getPlaylists, postPlaylist, postPlaylistTrack } from '../../store/playlist';
import './Card.css';

const Card = ({ data, chooseTrack, selectedPlaylist, setSelectedPlaylist, loading }) => {
  const { albumUrl, artist, title } = data;
  const accessToken = useSelector(state => state.spotifyReducer.accessToken);
  const playlistsObj = useSelector(state => state.playlistReducer);
  const dispatch = useDispatch();

  const handlePlay = async () => {
    if (loading) return;
    let newPlaylist = selectedPlaylist;
    
    if (Object.keys(playlistsObj).length === 0) {
      newPlaylist = await dispatch(postPlaylist({ title: 'New Playlist' }));
      setSelectedPlaylist(newPlaylist);
    }
    
    await dispatch(getPlaylists());
    
    if (newPlaylist && playlistsObj[newPlaylist?.id]) {
      await dispatch(postPlaylistTrack(newPlaylist.id, data));
    }
    
    chooseTrack(data);
  };

  return (
    <div className="card" onClick={handlePlay}>
      <div className="cardImage">
        <img src={albumUrl} alt={`${artist} - ${title}`} />
      </div>
      <div className="cardContent">Artist: {artist}</div>
      <div className="cardContent">Song Name: {title}</div>
      <div className="playIcon">
        <FontAwesomeIcon icon={faCirclePlay} />
      </div>
    </div>
  );
};

export default Card;
