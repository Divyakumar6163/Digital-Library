import * as bookactions from "../actions/bookactions";

const initialState = {
  booktitle: "Nothing purifies than knowledge",
  createdby: "ABCD",
  description: "",
  creaters: [],
  author: "",
  chapters: [],
  tags: [],
  summary: "",
  booktype: "",
  createdat: "",
  ispublished: false,
  coverImg: null,
};

const bookreducer = (state = initialState, action) => {
  switch (action.type) {
    case bookactions.SET_BOOK_DETAILS:
      return {
        ...state,
        booktitle: action.booktitle,
        createdby: action.createdby,
        description: action.description,
        creaters: action.creaters,
        author: action.author,
        summary: action.summary,
        booktype: action.booktype,
        createdat: action.createdat,
        ispublished: action.ispublished,
        chapters: action.chapters,
        tags: action.tags,
        coverImg: action.coverImg,
      };

    case bookactions.SET_CHAPTERS:
      return {
        ...state,
        chapters: action.chapters,
      };
    case bookactions.SET_PUBLISH:
      return {
        ...state,
        ispublished: action.book.ispublished,
      };
    case bookactions.ADD_CHAPTER:
      return {
        ...state,
        chapters: [...state.chapters, action.chapter],
      };

    case bookactions.UPDATE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters?.map((chapter) =>
          chapter._id === action.id ? action.updatedChapter : chapter
        ),
      };

    case bookactions.DELETE_CHAPTER:
      return {
        ...state,
        chapters: state.chapters.filter((_, index) => index !== action.index),
      };

    case bookactions.SET_TAGS:
      return {
        ...state,
        tags: action.tags,
      };
    case bookactions.UPDATE_BOOK_CHAPTERS:
      return {
        ...state,
        chapters: action.payload.chapters,
      };

    default:
      return state;
  }
};

export default bookreducer;
