// authTypes.js
export const SPOTIFY_LOGIN_SUCCESS = "auth/SPOTIFY_LOGIN_SUCCESS";
export const SPOTIFY_LOGIN_FAILURE = "auth/SPOTIFY_LOGIN_FAILURE";
export const SPOTIFY_REFRESH_SUCCESS = "auth/SPOTIFY_REFRESH_SUCCESS";
export const SPOTIFY_REFRESH_FAILURE = "auth/SPOTIFY_REFRESH_FAILURE";

// authActions.js
export const spotifyLoginSuccess = (data) => ({
  type: SPOTIFY_LOGIN_SUCCESS,
  data,
});

export const spotifyLoginFailure = (error) => ({
  type: SPOTIFY_LOGIN_FAILURE,
  error,
});

export const spotifyRefreshSuccess = (data) => ({
  type: SPOTIFY_REFRESH_SUCCESS,
  data,
});

export const spotifyRefreshFailure = (error) => ({
  type: SPOTIFY_REFRESH_FAILURE,
  error,
});

export const loginSpotify = (data) => {
  return async (dispatch) => {
    try {
      const response = await fetch("/api/auth/login_spotify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        let data = dispatch(spotifyLoginSuccess(responseData));
        return data;
      } else {
        const errorData = await response.json();
        let data = dispatch(spotifyLoginFailure(errorData));
        return data;
      }
    } catch (error) {
      dispatch(spotifyLoginFailure(error));
    }
  };
};

export const refreshSpotifyToken = (refreshToken) => {
  return async (dispatch) => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const responseData = await response.json();
        dispatch(spotifyRefreshSuccess(responseData));
      } else {
        const errorData = await response.json();
        dispatch(spotifyRefreshFailure(errorData));
      }
    } catch (error) {
      dispatch(spotifyRefreshFailure(error));
    }
  };
};

// authReducer.js
const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  expiresAt: null,
  scope: null,
  error: null,
};

const spotifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.data.access_token,
        refreshToken: action.data.refresh_token,
        expiresIn: action.data.expires_in,
        expiresAt: action.data.expires_at,
        scope: action.data.scope,
        error: null,
      };
    case SPOTIFY_LOGIN_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case SPOTIFY_REFRESH_SUCCESS:
      return {
        ...state,
        accessToken: action.data.access_token,
        expiresIn: action.data.expires_in,
        expiresAt: action.data.expires_at,
      };
    case SPOTIFY_REFRESH_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default spotifyReducer;