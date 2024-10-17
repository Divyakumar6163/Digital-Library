//deploy commit

import HeroPage from "./pages/Heropage.jsx";
import BookStore from "./pages/BookStorePage.jsx";
import BooksLibrary from "./pages/BooksLibrary.jsx";
import { useEffect } from "react";
import CreateBook from "./pages/CreateBook.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUpPage from "./components/SignUp";
import SetNewPassword from "./components/newpassword.jsx";
import ForgotPassword from "./components/forgotpassword.jsx";
import { ToastContainer } from "react-toastify";
import {  useSelector } from "react-redux";
import { checktoken} from "./API/userlogin.jsx";
import { getallbooks, getalltags } from "./API/filteringbook.jsx";
import Updatebook from "./pages/Updatebook.jsx";
import Readbook from "./pages/Readbook.jsx";
import "react-toastify/dist/ReactToastify.css";

// export const ToLink  = process.env.TO_LINK
export const ToLink = "https://digital-library-cryf.onrender.com";
// export const ToLink = "http://localhost:5000";
function App() {
  const access_token = useSelector((state) => state.auth.accessToken)
  const refresh_token = useSelector((state) => state.auth.refreshToken)
  useEffect(() => {
    // getuserlogin();
    checktoken(access_token, refresh_token);
    getallbooks();
    getalltags();
  }, []);
  return (
    <div>
      {/* <BrowserRouter basename={"Digital-Library"}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/bookStore" element={<BookStore />} />
          <Route path="/book/:category" element={<BooksLibrary />} />
          <Route path="/createBook" element={<CreateBook />} />
          <Route path="/adminBook" element={<AdminPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/readbook/:bookID" element={<Readbook />} />
          <Route path="/updatebook/:bookID" element={<Updatebook />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/:token/:userId" element={<SetNewPassword />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer draggable />
    </div>
  );
}

export default App;
