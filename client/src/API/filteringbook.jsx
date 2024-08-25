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
    const response = await axios.get(`${ToLink}/getalltags`);
    const tagarr = response.data.data.tags;
    const resultObject = tagarr.reduce((obj, [key, value]) => {
      obj[key] = {
        value: value,
        isSelected: false,
      };
      return obj;
    }, {});
    store.dispatch(bookactions.set_booktags(resultObject));
    console.log(response.data.data.tags);
  } catch (e) {
    console.log("Error in fetching tags");
    console.log(e);
  }
};
export const filteredbooks = (AllBooks,tags) => {
  const selectedTags = Object.keys(tags).filter(tag => tags[tag].isSelected);

  console.log('Selected Tags:', selectedTags);
  if (selectedTags.length > 0) {
    const filteredBooks = AllBooks.filter(book =>
      book.tags.some(tag => selectedTags.includes(tag))
    );
    store.dispatch(bookactions.set_filteredbook(filteredBooks));
  } else {
    store.dispatch(bookactions.set_filteredbook(AllBooks));
  }
}