import { deleteBook } from "../../API/createbook";
import { notify } from "../../store/utils/notify";
const handleDiscard = async (bookinfo, navigate) => {
  try {
    const response = await deleteBook(bookinfo._id);
    console.log(response?.status);
    if (response === true) {
      notify("Book deleted successfully");
      navigate(-1);
    } else {
      notify("Failed to delete book");
    }
  } catch (e) {
    console.error("Error discarding book:", e);
    notify("An error occurred while discarding the book");
  }
};
export default handleDiscard;
