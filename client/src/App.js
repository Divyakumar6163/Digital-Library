import HeroPage from "./pages/Heropage.jsx";
import BookStore from "./pages/BookStorePage.jsx";
import CreateBook from "./pages/CreateBook.jsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import Login from "./components/Login";
import SignUpPage from "./components/SignUp";
function App() {
  return (
    <div>
      {/* <BrowserRouter basename={"Digital-Library"}> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/bookStore" element={<BookStore />} />
          <Route path="/createBook" element={<CreateBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUpPage />} />
        </Routes>
        {/* <Login />
      <SignUpPage /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
