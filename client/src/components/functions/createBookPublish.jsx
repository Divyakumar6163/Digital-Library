// Update `handlePublish` function
import { notify } from "../../store/utils/notify";
import { updatePublish } from "../../API/createbook";
import * as useractions from "./../../store/actions/bookactions";

const handlePublish = async (bookinfo, navigate, curbookdispatch) => {
  if (bookinfo.ispublished === null) {
    const updatedBookInfo = { ...bookinfo, ispublished: false }; // Update `ispublished` to false
    // console.log(updatedBookInfo);
    try {
      const response = await updatePublish(updatedBookInfo._id, false); // Pass only the ID to the API function
      console.log(response?.status);

      if (response === true) {
        notify("Book successfully published");
        navigate(-1);
        // Update `bookinfo` in the Redux store with the new state of `ispublished`
        curbookdispatch(useractions.setPublish(updatedBookInfo));
      } else {
        notify("Failed to publish book");
      }
    } catch (error) {
      console.error("Error publishing book:", error);
      notify("An error occurred while publishing the book");
    }
  } else {
    notify("Book is already published");
  }
};
export default handlePublish;
