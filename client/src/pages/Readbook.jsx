import React, { useEffect, useState } from "react";
import PreviewBook from "../components/PreviewBookStore";
import NavBar from "../components/NavBar";
import { getbookbyID } from "../API/createbook";
import { useParams, useNavigate } from "react-router-dom";
import { notify } from "../store/utils/notify";
import Pageloader from "../store/utils/pageloader";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
export default function Readbook() {
  const navigate = useNavigate();
  const { bookID } = useParams();
  const [book, setBook] = useState(null);
  useEffect(() => {
    const fetchBook = async () => {
      if (bookID) {
        const fetchedBook = await getbookbyID(bookID);
        setBook(fetchedBook);
        if (!fetchedBook) {
          notify("Book not found");
          navigate("/bookStore");
        }
      }
    };
    fetchBook();
  }, [bookID]);

  return (
    <>
      <NavBar />

      {book ? (
        <PreviewBook chapters={book.chapters} bookinfo={book} ispre={false} />
      ) : (
        <div className="flex justify-around">
          <Pageloader />
        </div>
      )}
      {/* <Pagination book={book} /> */}
      <Footer />
    </>
  );
}
