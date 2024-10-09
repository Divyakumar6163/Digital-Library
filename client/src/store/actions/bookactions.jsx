export const SET_BOOK_DETAILS = "SET_BOOK_DETAILS";
export const SET_CHAPTERS = "SET_CHAPTERS";
export const ADD_CHAPTER = "ADD_CHAPTER";
export const UPDATE_CHAPTER = "UPDATE_CHAPTER";
export const DELETE_CHAPTER = "DELETE_CHAPTER";
export const SET_TAGS = "SET_TAGS";

// Action creators
export const setBookDetails = (bookDetails) => ({
  type: SET_BOOK_DETAILS,
  payload: bookDetails, // Pass the book details as the payload
});

export const setChapters = (chapters) => ({
  type: SET_CHAPTERS,
  payload: chapters, // Pass the chapters as the payload
});

export const addChapter = (chapter) => ({
  type: ADD_CHAPTER,
  payload: chapter, // Pass the new chapter as the payload
});

export const updateChapter = (index, updatedChapter) => ({
  type: UPDATE_CHAPTER,
  payload: { index, updatedChapter }, // Use an object for multiple payloads
});

export const deleteChapter = (index) => ({
  type: DELETE_CHAPTER,
  payload: index, // Pass the index to delete as the payload
});

export const setTags = (tags) => ({
  type: SET_TAGS,
  payload: tags, // Pass the tags as the payload
});
