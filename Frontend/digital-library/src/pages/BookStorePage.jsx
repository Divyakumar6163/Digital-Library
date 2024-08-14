import NavBar from "../components/NavBar";
import Filter from "../components/Filter";
import ReadBookStore from "../components/ReadBookStore";
import Footer from "../components/Footer";
const BookStore = () => {
  return (
    <>
      <NavBar />
      <Filter />
      <ReadBookStore heading="Newly Released" />
      <ReadBookStore heading="Science Fiction" />
      <ReadBookStore heading="Premium" />
      <Footer />
    </>
  );
};
export default BookStore;
