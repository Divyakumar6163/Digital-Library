import NavBar from "../components/NavBar";
import Filter from "../components/Filter";
import ReadBookStore from "../components/ReadBookStore";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
const BookStore = () => {
  const Filteredbooks = useSelector((state) => state.books.filteredbooks);
  const filterpremiumbook = Filteredbooks.filter((book) => book.booktype === "Premium");
  const Normalbooks = Filteredbooks.filter((book) => book.booktype === "Normal");
  const today = new Date();
  const thresholdDate = new Date(today);
  thresholdDate.setDate(today.getDate() - 5);


  const categorizeBooks = (books) => {
    const newReleases = [];
    const pastReleases = [];

    books.forEach((book) => {
      // console.log(book.createdat)
      const bookCreatedAt = new Date(book.createdat); 
      if (bookCreatedAt >= thresholdDate) {
        newReleases.push(book);
      } else {
        pastReleases.push(book);
      }
    });

    return { newReleases, pastReleases };
  };
  const { newReleases, pastReleases } = categorizeBooks(Normalbooks);
  const newrelebook = newReleases.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
  console.log("New Releases:", newReleases);
  console.log("Past Releases:", pastReleases);
  return (
    <>
      <NavBar />
      <Filter />
      <ReadBookStore heading="Newly Released" books={newrelebook} />
      <ReadBookStore heading=" Past Books" books={pastReleases} />
      <ReadBookStore heading="Premium" books={filterpremiumbook} />
      <Footer />
    </>
  );
};
export default BookStore;
