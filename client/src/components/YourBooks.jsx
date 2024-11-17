import React from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { notify } from "../store/utils/notify";
import { useState, useEffect } from "react";
import { getuserbook } from "../API/userlogin";

const BookStore = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [books, setBook] = useState([]);
  const userState = useSelector((state) => state.user);
  const isuser = useSelector((state) => state.user);
  console.log(books);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getuserbook(accessToken);
        console.log(res.books);
        setBook(res.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    if (accessToken) {
      fetchBooks();
    }
  }, [accessToken]);

  function handleReadBook(data) {
    if (!isuser.islogin) {
      notify("Please login first");
      return;
    }
    if (
      data.booktype === "Premium" &&
      userState.userinfo.ispreminum === false
    ) {
      notify("Please purchase a membership to access this book");
      navigate("/premium");
    } else {
      navigate(`/readbook/${data._id}`);
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Books</h2>
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
                onClick={() => handleReadBook(book)}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                style={{ cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
                  >
                    Read More
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
