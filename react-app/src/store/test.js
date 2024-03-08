// constants
const SET_TOKEN = "test/SET_TOKEN";
const REMOVE_USER = "test/REMOVE_USER";

const setToken = (data) => ({
  type: SET_TOKEN,
  data,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const initialState = { };


export const getToken = () => async (dispatch) => {
  try {
    const response = await fetch("/api/auth/accessToken")

    console.log(response)

    if (response.ok) {
      const data = await response.json();
      dispatch(setToken(data));
    } else {
      const data = await response.json();
      console.error("Failed to obtain token:", data);
    }
  } catch (error) {
    console.error("Error during token retrieval:", error);
  }
};

// export const refresh = () => async (dispatch) => {
//   try {
//     const response = await fetch("/api/users/refresh")



//     if (response.ok) {
//       const data = await response.json();
//       dispatch(setUser(data));
//     } else {
//       const data = await response.json();
//       console.error("Login failed:", data);
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//   }
// };

export default function testReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:

    // let data = action.data.Authorization.split("Bearer ")[1]
    let response = action.data
    
      return {...response};
    // case REMOVE_USER:
    //   return { user: null };
    default:
      return state;
  }
}
