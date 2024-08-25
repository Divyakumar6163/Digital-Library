import axios from "axios";
import { store } from "./../store/store";
import * as bookactions from "./../store/actions/bookinfoactions";
import { ToLink } from "../App";

export const getallbooks = async () => {
    try {
      const response = await axios.get(`${ToLink}/books`)
      store.dispatch(bookactions.setallbooks(response.data.data.books));
      store.dispatch(bookactions.set_filteredbook(response.data.data.books));
      console.log(response.data.data.books);
    } catch (e) {
      console.log("error in book fetching");
      console.log(e);
    }
};
export const getalltags = async () => {
  try {
    // Make the API call to get tags
    const response = await axios.get(`${ToLink}/getalltags`);

    // Assuming response.data.data.tags is an array of [key, value] pairs
    const tagarr = response.data.data.tags;

    // Reduce to convert the array into an object with the desired structure
    const resultObject = tagarr.reduce((obj, [key, value]) => {
      obj[key] = {
        value: value,
        isSelected: false,
      };
      return obj;
    }, {});

    // Dispatch the action to update the store
    store.dispatch(bookactions.set_booktags(resultObject));

    // Optional: Log the tags for debugging
    console.log(response.data.data.tags);
  } catch (e) {
    // Handle any errors that occur during the API call or processing
    console.log("Error in fetching tags");
    console.log(e);
  }
};
