import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BookCategory from "../components/BookCategory";
function BooksLibrary() {
  return (
    <div>
      <NavBar />
      <BookCategory />
      <Footer />
    </div>
  );
}

export default BooksLibrary;
