import NavBar from "../components/NavBar";
import ReadBookStore from "../components/ReadBookStore";
import Footer from "../components/Footer";
const BookStore = () => {
  return (
    <>
      <NavBar />
      <ReadBookStore heading="Newly Released" />
      <ReadBookStore heading="Science Fiction" />
      <ReadBookStore heading="Premium" />
      <Footer />
    </>
  );
};
export default BookStore;
