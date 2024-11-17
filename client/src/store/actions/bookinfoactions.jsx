export const SET_ALL_BOOKS = "SET_ALL_BOOKS";
export const SET_BOOK_TAGS = "SET_BOOK_TAGS";
export const SET_FILTERED_BOOKS = "SET_FILTERED_BOOKS";
export const SET_SEARCH_BOOKS = "SET_SEARCH_BOOKS";
export const setallbooks = (allbooks) => {
  return {
    type: SET_ALL_BOOKS,
    allbooks,
  };
};
export const set_booktags = (alltags) => {
  return {
    type: SET_BOOK_TAGS,
    alltags,
  };
};
export const setSearchBooks = (searchBooks) => {
  return { type: SET_SEARCH_BOOKS, searchBooks };
};
export const set_filteredbook = (filteredbooks) => {
  return {
    type: SET_FILTERED_BOOKS,
    filteredbooks,
  };
};
