import axios from "axios";
import { store } from "./../store/store";
import * as useractions from "./../store/actions/userinfoactions";
import { ToLink } from "../App";
// const navigate = useNavigate();

export const getuserlogin = async () => {
  try {
    const data = {};
    // console.log(response.data);
    const response = await axios.post(
      `${ToLink}/user/login`,
      data,
      {
        withCredentials: true,
      }
    );
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
