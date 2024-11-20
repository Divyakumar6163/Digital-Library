import React, { useState } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
// import { loginUser } from "../store2/userSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToLink } from "../App";
import { notify } from "../store/utils/notify";
import Spinner from "../store/utils/spinner";
function ForgotPassword() {
  const [email, setEmailId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function resetdetails(e) {
    e.preventDefault();
    try {
      const data = {
        emailid: email,
      };
      setLoading(true);
      console.log(data);
      const response = await axios.post(
        `${ToLink}/reqresetpassword`,
        data ,
        {
          withCredentials: true,
        }
      );
      notify(
        "Email sent.. please check your inbox to reset your password"
      );
      navigate("/login");
      setLoading(false);
      console.log(response.data);
    } catch (e) {
      setLoading(false);
      console.log("sadfghjk");
      console.log(e);
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
              Reset your account
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
              <button
                type="submit"
                onClick={resetdetails}
                className="w-full text-white flex justify-around bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {loading ? <Spinner/> : "Reset your details"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t want to forgot?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Login
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
export default ForgotPassword;
