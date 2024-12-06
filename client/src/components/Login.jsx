import React, { useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
// import { store } from "./../store/store";
// import { loginUser } from "../store2/userSlice";
import { Link } from "react-router-dom";
import { store } from "./../store/store";
import * as useractions from "./../store/actions/userinfoactions";
import * as authactions from "./../store/actions/authactions";
import { useNavigate } from "react-router-dom";
import GoogleLoginPage from "./Auth/login_signupgoogle";
import { ToLink } from "../App";
// import { ToLink } from "../App";
import { notify } from "../store/utils/notify";
import Spinner from "../store/utils/spinner";
import axios from "axios";
function Login() {
  const [email, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginuser(e) {
    e.preventDefault();
    setLoading(true); // Start loading immediately

    try {
      const data = {
        emailid: email,
        password: password,
      };

      // Check for empty fields
      if (data.emailid === "" || data.password === "") {
        notify("Please fill all the fields");
        setLoading(false); // Stop loading on validation error
        return;
      }

      // Perform login request
      const response = await axios.post(`${ToLink}/user/login`, data, {
        withCredentials: true,
      });
      // console.log(response);
      if (response.data) {
        store.dispatch(useractions.setuserinfo(response.data.user));
        store.dispatch(authactions.setAccessToken(response.data.AccessToken));
        store.dispatch(authactions.setRefreshToken(response.data.RefreshToken));
        store.dispatch(useractions.setlogin(true));
        notify("Login successful");
        navigate("/");
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (e.response && e.response.data) {
        notify(e.response.data.message);
        console.log(e.response.data.message);
      } else {
        notify("An unexpected error occurred");
        console.log(e.message);
      }
    }
  }

  return (
    <>
      <NavBar />
      <section
        className=" dark:bg-gray-900 min-h-screen flex items-center justify-center"
        style={{ alignItems: "center", justifySelf: "center" }}
      >
        <div
          className="bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
          style={{ alignItems: "center", justifySelf: "center" }}
        >
          <div
            className="p-6 space-y-4 md:space-y-6 sm:p-8"
            style={{ alignItems: "center", justifySelf: "center" }}
          >
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  onChange={(e) => setEmailId(e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="/forgotpassword" // Adjust the path as needed
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                onClick={loginuser}
                type="submit"
                className="w-full flex justify-around text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? <Spinner /> : "Sign in"}
              </button>
              <div>
                <GoogleLoginPage />
              </div>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
