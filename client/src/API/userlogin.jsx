import axios from "axios";
import { store } from "./../store/store";
import * as useractions from "./../store/actions/userinfoactions";
import { ToLink } from "../App";
// const navigate = useNavigate();
// import { useDispatch, useSelector } from "react-redux";
import * as authactions from "./../store/actions/authactions";
export const getuserlogin = async () => {
  try {
    const data = {};
    // console.log(response.data);
    const response = await axios.post(`${ToLink}/user/login`, data, {
      withCredentials: true,
    });
    console.log(response.cookie);
    // window.alert("Login successful");
    // navigate('/');
    store.dispatch(useractions.setuserinfo(response.data.data));
    store.dispatch(useractions.setlogin(true));
    console.log(response.data);
  } catch (e) {
    console.log("sadfghjk");
    console.log(e);
  }
};
export const checktoken = async (accessToken, refreshToken) => {
  console.log(accessToken);
  // console.log(refreshToken);
  try {
    const response = await axios.get(`${ToLink}/authcheck`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    if (response.status === 200) {
      // return response;
      store.dispatch(useractions.setuserinfo(response.data.data.user));
      store.dispatch(useractions.setlogin(true));
    }
    // console.log(response.status)
    if (response.status === 401 || response.status === 403) {
      console.log(refreshToken);
      const refreshResponse = await axios.post(`${ToLink}/authcheck/refresh`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { token: refreshToken },
      });
      console.log(refreshResponse.data.accessToken);
      if (refreshResponse.status === 200) {
        console.log(refreshResponse.data);
        const newAccessToken = refreshResponse.data.accessToken;
        store.dispatch(authactions.setAccessToken(newAccessToken));
        // store.dispatch(authactions.setRefreshToken(refreshResponse.data.refreshToken));

        const retryResponse = await axios.get(`${ToLink}/authcheck`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        // return retryResponse;
        console.log(retryResponse.data);
      } else {
        store.dispatch(authactions.setAccessToken(null));
        store.dispatch(authactions.setRefreshToken(null));
      }
    }
  } catch (e) {
    console.error("An error occurred while checking the tokens:", e);
  }
};
export const getuserbook = async (accessToken) => {
  try {
    const response = await axios.get(`${ToLink}/mybooks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    // console.error('An error occurred while fetching user books:', error);
  }
};
export const updateProfile = async (userInfo) => {
  console.log(userInfo);
  try {
    const response = await axios.post(`${ToLink}/user/profile`, userInfo, {
      headers: {
        Authorization: `Bearer ${store.getState().auth.accessToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    // console.error('An error occurred while fetching user books:', error);
  }
};
