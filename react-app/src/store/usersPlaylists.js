// lyricsReducer.js
export const GET_USERS_PLAYLISTS = "lyrics/GET_USERS_PLAYLISTS";
// export const CLEAR_LYRICS = "lyrics/CLEAR_LYRICS"

export const getUsersPlaylistsAC = (data) => ({
  type: GET_USERS_PLAYLISTS,
  data,
});

// export const getLyricsFailure = (error) => ({
//   type: GET_LYRICS_FAILURE,
//   error,
// });

// export const clearLyricsAC = () => ({
//   type: CLEAR_LYRICS
// })

export const getUsersPlaylists = (username) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `/api/users/${username}/playlists`
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(getUsersPlaylistsAC(data));
      } else {
        const data = await response.json();
        console.error("Error obtaining playlists:", data);
      }
    } catch (error) {
      console.error("Error obtaining playlists:", error);
    }
}
};

// export const clearLyrics = () => async (dispatch) => {
//   dispatch(clearLyricsAC())
// }

const initialState = {};

const usersPlaylistsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_PLAYLISTS:
      let newState = {}
      if(action.data.playlists) {
        action.data.playlists.forEach((playlist) => {
          newState[playlist.id] = playlist;
        });
      }
        return newState;
    default:
      return state;
  }
};

export default usersPlaylistsReducer;
