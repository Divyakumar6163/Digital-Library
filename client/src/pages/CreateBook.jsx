import NavBar from "../components/NavBar";
import CreateBookStore from "../components/CreateBookStore";
import CreateBookIntro from "../components/CreateBookIntro";
import Footer from "../components/Footer";
import { useState ,useEffect } from "react";
import { useSelector } from "react-redux";
import ReadBookStore from '../components/ReadBookStore'
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { getuserbook } from "../API/userlogin";
const CreateBook = () => {
  const navigate = useNavigate();
  const Filteredbooks = useSelector((state) => state.books.filteredbooks);
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

  return (
    <>
      <NavBar />
      {/* <button onClick={handlecreateBook}>Create new book</button> */}
      <div className="card flex justify-content-center mt-14 pt-3 justify-around">
        <Button 
          label="Create New Book" 
          icon="pi pi-plus" 
          className="p-button-rounded p-button-lg custom-create-btn bg-slate-400 p-3 m-2 rounded-md" 
          onClick={handlecreateBook}
        />
      </div>
      {createbook && <CreateBookIntro />}
      {/* {!isIntro && <CreateBookStore setIsIntro={setIsIntro} />} */}
      <ReadBookStore heading="Your Books" books={book} />
      <Footer />
    </>
  );
};
export default CreateBook;
