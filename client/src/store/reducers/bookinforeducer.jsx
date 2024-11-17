import * as bookinfoactions from "../actions/bookinfoactions";

const initialState = {
  allbooks: [],
  alltags: {},
  filteredbooks: [],
  searchBooks: [],
};

const bookinfoeeducer = (state = initialState, action) => {
  switch (action.type) {
    case bookinfoactions.SET_ALL_BOOKS:
      return {
        ...state,
        allbooks: action.allbooks,
      };
    case bookinfoactions.SET_BOOK_TAGS:
      return {
        ...state,
        alltags: action.alltags,
      };
    case bookinfoactions.SET_SEARCH_BOOKS:
      return {
        ...state,
        searchBooks: action.searchBooks,
      };
    case bookinfoactions.SET_FILTERED_BOOKS:
      return {
        ...state,
        filteredbooks: action.filteredbooks,
      };
    default:
      return state;
  }
};

export default bookinfoeeducer;
