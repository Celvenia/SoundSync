// PLAYLISTSReducer.js
export const GET_PLAYLISTS_SUCCESS = "playlists/GET_PLAYLISTS_SUCCESS";
export const GET_PLAYLISTS_FAILURE = "playlists/GET_PLAYLISTS_FAILURE";

export const getPlaylistsSuccess = (playlists) => ({
  type: GET_PLAYLISTS_SUCCESS,
  playlists,
});

export const getPlaylistsFailure = (error) => ({
  type: GET_PLAYLISTS_FAILURE,
  error,
});

export const getPlaylists = (user_id) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

const initialState = {
  PLAYLISTS: null,
  error: null,
};

const playlistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PLAYLISTS_SUCCESS:
      return {
        ...state,
        PLAYLISTS: action.PLAYLISTS,
        error: null,
      };
    case GET_PLAYLISTS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default playlistsReducer;
