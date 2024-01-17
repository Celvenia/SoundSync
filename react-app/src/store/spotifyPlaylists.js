// PLAYLISTSReducer.js
export const GET_PLAYLISTS_SUCCESS = "playlists/GET_PLAYLISTS_SUCCESS";
export const GET_PLAYLISTS_FAILURE = "playlists/GET_PLAYLISTS_FAILURE";
export const GET_PLAYLIST_TRACKS_SUCCESS =
  "playlists/GET_PLAYLIST_TRACKS_SUCCESS";
export const GET_PLAYLIST_TRACKS_FAILURE =
  "playlists/GET_PLAYLIST_TRACKS_FAILURE";
export const DELETE_PLAYLIST_SUCCESS = "playlists/DELETE_PLAYLIST_SUCCESS";
export const DELETE_PLAYLIST_FAILURE = "playlists/DELETE_PLAYLIST_FAILURE";

export const getPlaylistTracksSuccess = (tracks) => ({
  type: GET_PLAYLIST_TRACKS_SUCCESS,
  tracks,
});

export const getPlaylistTracksFailure = (error) => ({
  type: GET_PLAYLIST_TRACKS_FAILURE,
  error,
});

export const getPlaylistsSuccess = (playlists) => ({
  type: GET_PLAYLISTS_SUCCESS,
  playlists,
});

export const getPlaylistsFailure = (error) => ({
  type: GET_PLAYLISTS_FAILURE,
  error,
});

export const deletePlaylistSuccess = (playlist) => ({
  type: DELETE_PLAYLIST_SUCCESS,
  playlist,
});

export const deletePlaylistFailure = (error) => ({
  type: DELETE_PLAYLIST_FAILURE,
  error,
});

export const getPlaylists = (user_id, accessToken) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(getPlaylistsSuccess(data));
        return data;
      } else {
        const errorData = await response.json();
        dispatch(getPlaylistsFailure(errorData));
        return errorData;
      }
    } catch (error) {
      dispatch(getPlaylistsFailure(error));
    }
  };
};

export const getPlaylistTracks = (accessToken, playlistId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const tracksWithURIs = data.items.map((item) => {
          return {
            ...item,
            uri: item.track.uri,
          };
        });
        console.log(tracksWithURIs);
        dispatch(getPlaylistTracksSuccess(tracksWithURIs));
        return tracksWithURIs;
      } else {
        const errorData = await response.json();
        dispatch(getPlaylistTracksFailure(errorData));
        return errorData;
      }
    } catch (error) {
      dispatch(getPlaylistTracksFailure(error));
    }
  };
};

export const deletePlaylistTracks = (accessToken, playlist, data) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        dispatch(deletePlaylistSuccess(playlist));
        return true;
      } else {
        const errorData = await response.json().catch(() => null);
        dispatch(deletePlaylistFailure(errorData));
        return false;
      }
    } catch (error) {
      dispatch(deletePlaylistFailure(error));
      return false;
    }
  };
};

// export const deletePlaylistTracks = (accessToken, playlist, data) => {
//   return async (dispatch) => {
//     try {
//       const response = await fetch(`/api/playlists/${playlist.id}/tracks`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (response.ok) {
//         dispatch(deletePlaylistSuccess(playlist));
//         return true;
//       } else {
//         const errorData = await response.json().catch(() => null);
//         dispatch(deletePlaylistFailure(errorData));
//         return false;
//       }
//     } catch (error) {
//       dispatch(deletePlaylistFailure(error));
//       return false;
//     }
//   };
// };

const initialState = {
  playlists: null,
  playlistTracks: null,
  error: null,
};

const spotifyPlaylistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYLISTS_SUCCESS:
      return {
        ...state,
        playlists: action.playlists,
        error: null,
      };
    case GET_PLAYLISTS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case GET_PLAYLIST_TRACKS_SUCCESS:
      return {
        ...state,
        playlistTracks: action.tracks,
        error: null,
      };
    case GET_PLAYLIST_TRACKS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case DELETE_PLAYLIST_SUCCESS:
      return {
        ...state,
        playlists: state.playlists.filter(
          (playlist) => playlist.id !== action.playlistId
        ),
        error: null,
      };
    case DELETE_PLAYLIST_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
};

export default spotifyPlaylistsReducer;
