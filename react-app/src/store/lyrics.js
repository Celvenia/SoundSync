// lyricsReducer.js
export const GET_LYRICS_SUCCESS = "lyrics/GET_LYRICS_SUCCESS";
export const GET_LYRICS_FAILURE = "lyrics/GET_LYRICS_FAILURE";
export const CLEAR_LYRICS = "lyrics/CLEAR_LYRICS"

export const getLyricsSuccess = (lyrics) => ({
  type: GET_LYRICS_SUCCESS,
  lyrics,
});

export const getLyricsFailure = (error) => ({
  type: GET_LYRICS_FAILURE,
  error,
});

export const clearLyricsAC = () => ({
  type: CLEAR_LYRICS
})

export const getLyrics = (artist, song) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `/api/songs/lyrics?artist=${artist}&song=${song}`
      );

      if (response.ok) {
        const { lyrics } = await response.json();
        dispatch(getLyricsSuccess(lyrics));
        return lyrics;
      } else {
        const errorData = await response.json();
        dispatch(getLyricsFailure(errorData));
        return errorData;
      }
    } catch (error) {
      dispatch(getLyricsFailure(error));
    }
  };
};

export const clearLyrics = () => async (dispatch) => {
  dispatch(clearLyricsAC())
}

const initialState = {
  lyrics: null,
  error: null,
};

const lyricsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LYRICS_SUCCESS:
      let newLyrics = action.lyrics.split("Lyrics")[1];
      return {
        ...state,
        lyrics: newLyrics,
        error: null,
      };
    case GET_LYRICS_FAILURE:
      return {
        ...state,
        lyrics: "Failed to obtain lyrics, Please try again",
        error: action.error,
      };
    case CLEAR_LYRICS: 
    const clearedLyrics = {
      lyrics: null,
      error: null,
    }
    return clearedLyrics
    default:
      return state;
  }
};

export default lyricsReducer;
