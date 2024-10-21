import React, { useEffect, useState } from "react";
import PreviewBook from "../components/PreviewBookStore";
import NavBar from "../components/NavBar";
import { getbookbyID } from "../API/createbook";
import CreateBookStore from "./../components/CreateBookStore";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Createbookloader } from "../store/utils/createbookloader";
import { notify } from "../store/utils/notify";
export default function Updatebook() {
  const { bookID } = useParams();
  const navigate = useNavigate();
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
      {book ? <CreateBookStore bookinfo={book} /> : <Createbookloader Heading="Fetching your book..."/>}
      <Footer />
    </>
  );
}
