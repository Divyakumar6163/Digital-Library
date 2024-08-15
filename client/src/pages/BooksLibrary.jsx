import React from "react";
import NavBar from "../components/NavBar";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import BookCategory from "../components/BookCategory";
import { useState } from "react";
function BooksLibrary() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div>
      <NavBar />
      <BookCategory />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Footer />
    </div>
  );
}

export default BooksLibrary;
