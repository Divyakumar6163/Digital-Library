import NavBar from "../components/NavBar";
import CreateBookIntro from "../components/CreateBookIntro";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReadBookStore from "../components/ReadBookStore";
import { Button } from "primereact/button";
import { getuserbook } from "../API/userlogin";
import PageNumber from "../components/Pagination";

const CreateBook = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [book, setBook] = useState([]);
  const [createbook, setcreatebook] = useState(false);

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

  function handlecreateBook() {
    setcreatebook((prevState) => !prevState);
  }
  const publishedBooks = book.filter((b) => b.ispublished === true);
  const unpublishedBooks = book.filter(
    (b) => b.ispublished === false || b.ispublished === null
  );

  return (
    <>
      <NavBar />
      <div className="card flex justify-content-center mt-14 pt-3 justify-around">
        <Button
          label={createbook ? "Close" : "Create New Book"}
          icon="pi pi-plus"
          className="p-button-rounded p-button-lg custom-create-btn bg-slate-400 p-3 m-2 rounded-md"
          onClick={handlecreateBook}
        />
      </div>

      {createbook && <CreateBookIntro />}

      <ReadBookStore
        heading="Your Unpublished Books"
        books={unpublishedBooks}
      />
      <ReadBookStore heading="Your Published Books" books={publishedBooks} />

      <Footer />
    </>
  );
};

export default CreateBook;
