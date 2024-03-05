// authTypes.js
export const SPOTIFY_LOGIN_SUCCESS = "auth/SPOTIFY_LOGIN_SUCCESS";
export const SPOTIFY_LOGIN_FAILURE = "auth/SPOTIFY_LOGIN_FAILURE";
export const SPOTIFY_REFRESH_SUCCESS = "auth/SPOTIFY_REFRESH_SUCCESS";
export const SPOTIFY_REFRESH_FAILURE = "auth/SPOTIFY_REFRESH_FAILURE";
export const SPOTIFY_USER_SUCCESS = "auth/SPOTIFY_USER_SUCCESS";
export const SPOTIFY_USER_FAILURE = "auth/SPOTIFY_USER_FAILURE";
export const SPOTIFY_LOGOUT = "auth/SPOTIFY_LOGOUT";

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

export const spotifyUserSuccess = (data) => ({
  type: SPOTIFY_USER_SUCCESS,
  data,
});

export const spotifyUserFailure = (error) => ({
  type: SPOTIFY_USER_FAILURE,
  error,
});

export const spotifyLogoutAC = () => ({
  type: SPOTIFY_LOGOUT,
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

export const getUserInfo = (accessToken) => {
  return async (dispatch) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      
      if (response.ok) {
        const userInfo = await response.json();

        // Send user data to the backend for verification and seeding

        const backendResponse = await fetch("/api/auth/verify_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        });

        if (backendResponse.ok) {
          // Backend verified the user, dispatch success action
          let data = dispatch(spotifyUserSuccess(userInfo));
          return data;
        } else {
          // Backend rejected the user, dispatch failure action
          const errorData = await backendResponse.json();
          let data = dispatch(spotifyUserFailure(errorData));
          return data;
        }
      } else {
        console.log(response)
        const errorData = await response.json();
        let data = dispatch(spotifyUserFailure(errorData));
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const spotifyLogout = () => {
  return async (dispatch) => {
      try {
        const response = await fetch("/api/auth/logout", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          dispatch(spotifyLogoutAC());
        } else {
          // Handle logout failure
          const errorData = await response.json();
          console.error("Logout failed:", errorData);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    // dispatch(spotifyLogoutAC());
  // };
};

// authReducer.js
const initialState = {
  displayName: null,
  id: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  // expiresAt: null,
  // scope: null,
  error: null,
};

const spotifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SPOTIFY_LOGIN_SUCCESS:
      return {
        ...state,
        accessToken: action.data.accessToken,
        refreshToken: action.data.refreshToken,
        expiresIn: action.data.expiresIn,
        // expiresAt: action.data.expires_at,
        // scope: action.data.scope,
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
    case SPOTIFY_USER_SUCCESS:
      return {
        ...state,
        displayName: action.data.display_name,
        id: action.data.id,
        email: action.data.email,
      };
    case SPOTIFY_USER_FAILURE:
      return {
        ...state,
      };
    case SPOTIFY_LOGOUT:
      const newState = {
        displayName: null,
        id: null,
        email: null,
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        expiresAt: null,
        scope: null,
        error: null,
      };
      return newState;
    default:
      return state;
  }
};

export default spotifyReducer;
