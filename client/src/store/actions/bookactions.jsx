export const SET_BOOK_DETAILS = "SET_BOOK_DETAILS";
export const SET_CHAPTERS = "SET_CHAPTERS";
export const ADD_CHAPTER = "ADD_CHAPTER";
export const UPDATE_CHAPTER = "UPDATE_CHAPTER";
export const DELETE_CHAPTER = "DELETE_CHAPTER";
export const SET_TAGS = "SET_TAGS";
export const SET_PUBLISH = "SET_PUBLISH";
export const UPDATE_BOOK_CHAPTERS = "UPDATE_BOOK_CHAPTERS";
export const setBookDetails = (bookDetails) => ({
  type: SET_BOOK_DETAILS,
  ...bookDetails,
});

export const setChapters = (chapters) => ({
  type: SET_CHAPTERS,
  chapters,
});
export const setPublish = (book) => ({
  type: SET_PUBLISH,
  book,
});

export const addChapter = (chapter) => ({
  type: ADD_CHAPTER,
  chapter,
});

export const updateChapter = (id, updatedChapter) => ({
  type: UPDATE_CHAPTER,
  id,
  updatedChapter,
});

export const deleteChapter = (index) => ({
  type: DELETE_CHAPTER,
  index,
});

export const setTags = (tags) => ({
  type: SET_TAGS,
  tags,
});
export const updateBookChapters = (bookId, updatedChapters) => ({
  type: UPDATE_BOOK_CHAPTERS,
  payload: { bookId, chapters: updatedChapters },
});
