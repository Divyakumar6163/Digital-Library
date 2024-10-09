import axios from "axios";
import { store } from "./../store/store";
import * as bookactions from "./../store/actions/bookinfoactions";
import { ToLink } from "../App";

export const createbook = async (bookinfo) =>{
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
          `http://localhost:5000/updatebook/${bookID}`, 
          { chapters: updatedChapters }, 
          // {
              // headers: {
              //     'Content-Type': 'application/json',
              //     'Authorization': `Bearer ${localStorage.getItem('token')}`
              // }
          // }/
      );
      if (response.status === 200) {
          console.log('Chapters updated successfully', response.data);
          return response.data; 
      } else {
          console.error('Failed to update chapters:', response.data);
          return null;
      }
  } catch (error) {
      console.error('Error occurred while updating chapters:', error);
      return null;
  }
};

export const getbookbyID = async (bookID) =>{
  try {
      const response = await axios.get(`http://localhost:5000/book/${bookID}`);
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