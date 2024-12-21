//Deploy commit

import HeroPage from "./pages/Heropage.jsx";
import BookStore from "./pages/BookStorePage.jsx";
import BooksLibrary from "./pages/BooksLibrary.jsx";
import { useEffect } from "react";
import CreateBook from "./pages/CreateBook.jsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import PaymentPage from "./components/PaymentPage";
import SignUpPage from "./components/SignUp";
import SetNewPassword from "./components/newpassword.jsx";
import AdminStore from "./components/AdminStore.jsx";
import ForgotPassword from "./components/forgotpassword.jsx";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { checktoken } from "./API/userlogin.jsx";
import { getallbooks, getalltags } from "./API/filteringbook.jsx";
import Updatebook from "./pages/Updatebook.jsx";
import Readbook from "./pages/Readbook.jsx";
import "react-toastify/dist/ReactToastify.css";
import PremiumPage from "./components/PremiumPage.jsx";
import UpdateIntro from "./components/UpdateIntro.jsx";
import SearchedBooks from "./components/SearchedBooks.jsx";
import YourBooks from "./components/YourBooks.jsx";
import CollabinvitationPage from './components/Addcollaborator.jsx'
import CoAuthorInvitationPage from "./components/Addcoauthor.jsx";
import ReviewerInvitationPage from "./components/Addreviewer.jsx";
import VerifyEamil from "./components/emailverify.jsx";
// export const ToLink  = process.env.TO_LINK
export const ToLink = "https://digital-library-cryf.onrender.com";
// export const ToLink = "http://localhost:5000";
//Nothing to commit
function App() {
  const access_token = useSelector((state) => state.auth.accessToken);
  const refresh_token = useSelector((state) => state.auth.refreshToken);
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/bookStore" element={<BookStore />} />
          <Route path="/book/:category" element={<BooksLibrary />} />
          <Route path="/createBook" element={<CreateBook />} />
          <Route path="/updateBookIntro/:bookId" element={<UpdateIntro />} />
          <Route path="/adminStore" element={<AdminStore />} />
          <Route path="/searchBooks" element={<SearchedBooks />} />
          <Route path="/yourBooks" element={<YourBooks />} />
          {/* <Route path="/adminBook/:bookID" element={<AdminPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/readbook/:bookID" element={<Readbook />} />
          <Route path="/updatebook/:bookID" element={<Updatebook />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/:token/:userId" element={<SetNewPassword />} />
          <Route path="/verifyemail/:token" element={<VerifyEamil />} />
          <Route path="/addcollaborator/:Addcollabtoken" element={<CollabinvitationPage />} />
          <Route path="/addcoauthor/:AddCoAuthorToken" element={<CoAuthorInvitationPage />} />
          <Route path="/addreviewer/:AddReviewerToken" element={<ReviewerInvitationPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer draggable />
    </div>
  );
}

export default App;
