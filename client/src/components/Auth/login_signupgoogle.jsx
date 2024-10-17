import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { notify } from "../../store/utils/notify";
import axios from "axios";
import store  from "./../../store/store";
import { useDispatch} from "react-redux";
import * as authactions from "./../../store/actions/authactions";
import * as useractions from "./../../store/actions/userinfoactions";
import { ToLink } from "../../App";
const GoogleLoginPage = () => {
//   const authCtx = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [response, setResponse] = useState(null);

  const responseMessage = (response) => {
    console.log(response);
    setResponse(response);
  };
  useEffect(() => {
    if (response) {
      const authenticate = async () => {
        try {
          console.log(`${ToLink}/auth/google`)
          const resp = await axios.post(`${ToLink}/auth/google`, {
            token: response.credential,
          });
          console.log(resp.data);
          dispatch(authactions.setAccessToken(resp.data.AccessToken));
          dispatch(authactions.setRefreshToken(resp.data.RefreshToken));
          store.dispatch(useractions.setuserinfo(resp.data.user))
          store.dispatch(useractions.setlogin(true));
          // console.log(resp.data);

          notify("Login successful");
          navigate('/');
        } catch (error) {
          console.error("Error authenticating user", error);
          // notify("Error authenticating user");
          if (error?.response?.data?.message) {
            notify(error.response.data.message);
          }
        }
      };
      authenticate();
    }
  }, [response]);

  const errorMessage = (error) => {
    console.log(error);
    notify("Error logging in");
  };
  return (
    <div>
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
};

export default GoogleLoginPage;
