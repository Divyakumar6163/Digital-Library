import * as bookactions from '../actions/bookactions';

const initialState = {
    booktitle: 'Nothing purifies than knowledge',
    createdby: 'ABCD',
    description: '',
    creaters: [],
    author: '',
    chapters: [],
    tags: [],
    summary: '',
    booktype: '',
    createdat: '',
    ispublished: false
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
                ispublished: action.ispublished
            };

        case bookactions.SET_CHAPTERS:
            return {
                ...state,
                chapters: action.chapters
            };

        case bookactions.ADD_CHAPTER:
            return {
                ...state,
                chapters: [...state.chapters, action.chapter]
            };

        case bookactions.UPDATE_CHAPTER:
            return {
                ...state,
                chapters: state.chapters.map((chapter, index) => 
                    index === action.index ? action.updatedChapter : chapter
                )
            };

        case bookactions.DELETE_CHAPTER:
            return {
                ...state,
                chapters: state.chapters.filter((_, index) => index !== action.index)
            };

        case bookactions.SET_TAGS:
            return {
                ...state,
                tags: action.tags
            };

        default:
            return state;
    }
};

export default bookreducer;
