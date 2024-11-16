import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
const BookStore = ({ title, books }) => {
  console.log(books);
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {books.length === 0 && (
            <div className="text-center text-gray-500 font-semibold my-4">
              <h3>No Book Found!</h3>
            </div>
          )}
          {books?.length !== 0 &&
            books.map((book, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={book.image}
                  alt={book.booktitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3
                    className="text-lg font-semibold mb-2"
                    dangerouslySetInnerHTML={{ __html: book.booktitle }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    //   onClick={() => handlePublish(book)}
                    style={{ cursor: "pointer" }}
                  >
                    Publish Now
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookStore;
