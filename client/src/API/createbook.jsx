import axios from "axios";
// import { store } from "./../store/store";
// import * as bookactions from "./../store/actions/bookinfoactions";
import { ToLink } from "../App";
import { notify } from "../store/utils/notify";
// import { useNavigate } from "react-router";

export const createbook = async (bookinfo) => {
    // console.log(bookinfo)
    const chaptersObject = bookinfo.reduce((acc, chapter, index) => {
        acc[`chapter${index + 1}`] = chapter;
        return acc;
    }, {});
    console.log(chaptersObject)
}

export const updateChapters = async (bookID, updatedChapters) => {
  try {
      const response = await axios.patch(
          `${ToLink}/updatebook/${bookID}`,
          { chapters: updatedChapters },
          // {
          //     headers: {
          //         'Content-Type': 'application/json',
          //         'Authorization': `Bearer ${localStorage.getItem('token')}`
          //     }
          // }
      );

      if (response.status === 200) {
          console.log('Chapters updated successfully', response.data);
          return true;
      } else {
          console.error('Failed to update chapters:', response.data);
          return false;
      }
  } catch (error) {
      console.error('Error occurred while updating chapters:', error);
      return false;
  }
};
export const getbookbyID = async (bookID) => {
    try {
        const response = await axios.get(`${ToLink}/book/${bookID}`);
        if (response.status === 200) {
            console.log('Book fetched successfully', response.data.data.book.chapters);
            return response.data.data.book;
        } else {
            console.error('Failed to fetch book:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error occurred while fetching book:', error);
        return null;
    }
}

export const createBook = async (imageFile, bookdata,accessToken) => {
    if (!imageFile) {
      notify("Please select an image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const uploadResponse = await axios.post(`${ToLink}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const bookinfo = {
        ...bookdata,
        image: uploadResponse.data.fileUrl,
      };
      console.log(bookinfo);
      console.log(accessToken)
      const createResponse = await axios.post(`${ToLink}/createbook`, bookinfo, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log(createResponse.data.data.books);
      const id = createResponse.data.data.books._id;
      notify("Book created!");
      return id;
    } catch (error) {
      console.error("There was an error:", error);
      notify("Error while creating book");
      return null;
    }
  };