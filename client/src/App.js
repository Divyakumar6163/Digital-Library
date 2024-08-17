import HeroPage from "./pages/Heropage.jsx";
import BookStore from "./pages/BookStorePage.jsx";
import BooksLibrary from "./pages/BooksLibrary.jsx";
import CreateBook from "./pages/CreateBook.jsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ReadFIB from "./components/ReadFIB.jsx";
import Login from "./components/Login";
import SignUpPage from "./components/SignUp";
import SetNewPassword from "./components/newpassword.jsx";
import ForgotPassword from './components/forgotpassword.jsx'
function App() {
  return (
    <div>
      {/* <BrowserRouter basename={"Digital-Library"}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/" element={<ReadFIB />} />
          <Route path="/bookStore" element={<BookStore />} />
          <Route path="/book/:category" element={<BooksLibrary />} />
          <Route path="/createBook" element={<CreateBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
          <Route path="/:token/:userId" element={<SetNewPassword/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
