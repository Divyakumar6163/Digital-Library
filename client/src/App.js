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
import { getuserlogin } from "./API/userlogin.jsx";
import { getallbooks, getalltags } from "./API/filteringbook.jsx";
import Readbook from "./pages/Readbook.jsx";
// export const ToLink = "https://digital-library-cryf.onrender.com";
export const ToLink = "http://localhost:5000";
function App() {
  useEffect(() => {
    getuserlogin();
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
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/:token/:userId" element={<SetNewPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
