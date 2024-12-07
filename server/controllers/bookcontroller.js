const Bookschema = require("./../models/bookmodel");
const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });

exports.getallbook = async (req, res) => {
  try {
    const books = await Bookschema.find();
    res.status(200).json({
      data: {
        books: books,
      },
      messege: "all books found",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error While fetching books",
      error: err,
    });
  }
};

exports.createbook = async (req, res) => {
  try {
    const bookinfo = {
      ...req.body,
      createdby: req.user._id,
    };
    console.log(bookinfo);
    const newBook = await Bookschema.create(bookinfo);
    res.status(200).json({
      data: {
        books: newBook,
      },
      messege: "book created",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error While creating books",
      error: err,
    });
  }
};

exports.createbook = async (req, res) => {
  try {
    const bookinfo = {
      ...req.body,
      createdby: req.user._id,
    };
    console.log(bookinfo);
    const newBook = await Bookschema.create(bookinfo);
    res.status(200).json({
      data: {
        books: newBook,
      },
      messege: "book created",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error While creating books",
      error: err,
    });
  }
};
exports.getbookbyID = async (req, res) => {
  try {
    const book = await Bookschema.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "book not found",
      });
    }
    res.status(200).json({
      data: {
        book: book,
      },
      messege: "book found",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error While fetching book",
      error: err,
    });
  }
};
exports.getalldistincttags = async (req, res) => {
  try {
    const listmap = new Map();
    const books = await Bookschema.find();
    const n = books.length;
    for (let i = 0; i < n; i++) {
      const tags = books[i].tags || [];
      const m = tags.length;
      for (let j = 0; j < m; j++) {
        const tag = tags[j];
        if (listmap.has(tag)) {
          listmap.set(tag, listmap.get(tag) + 1);
        } else {
          listmap.set(tag, 1);
        }
      }
    }
    const filteredTags = [...listmap].filter(([tag, count]) => count > 0);

    res.status(200).json({
      data: {
        tags: filteredTags,
      },
      message: "Tags retrieved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error while retrieving tags",
      error: err.message,
    });
  }
};

exports.publishbookuser = async (req, res) => {
  const { bookId } = req.params;
  const { ispublished } = req.body;

  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.ispublished = ispublished;
    await book.save();

    res.status(200).json({
      message: "Book content updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book content",
      error: error.message,
    });
  }
};
exports.updatebookintro = async (req, res) => {
  const { bookId } = req.params;
  const data = req.body;
  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.booktitle = data.booktitle;
    book.skills = data.skills;
    book.tags = data.tags;
    book.collaborators = data.collaborators;
    book.coAuthors = data.coAuthors;
    book.reviewers = data.reviewers;
    book.summary = data.summary;
    book.briefSummary = data.briefSummary;
    book.objective = data.objective;
    book.version = data.version;
    book.videoLink = data.videoLink;
    book.details = data.details;
    book.targetAudience = data.targetAudience;
    book.license = data.license;
    book.attributionTitle = data.attributionTitle;
    book.attributionAuthor = data.attributionAuthor;
    book.image = data.image;
    await book.save();

    res.status(200).json({
      message: "Book Intro updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book intro",
      error: error.message,
    });
  }
};
exports.updatebookcontent = async (req, res) => {
  const { bookId } = req.params;
  const { chapters, modifiedDate } = req.body;
  console.log(chapters);
  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.chapters = chapters;
    book.modifiedDate = modifiedDate;
    await book.save();

    res.status(200).json({
      message: "Book content updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book content",
      error: error.message,
    });
  }
};

exports.updatebooktype = async (req, res) => {
  const { bookId } = req.params;
  const { booktype } = req.body;

  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.booktype = booktype;
    await book.save();

    res.status(200).json({
      message: "Book type updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book type",
      error: error.message,
    });
  }
};

exports.updatebookimg = async (req, res) => {
  const { bookId } = req.params;
  const { imageUrl } = req.body;

  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.image = imageUrl;
    await book.save();

    res.status(200).json({
      message: "Book image updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book image",
      error: error.message,
    });
  }
};

exports.updatebooktags = async (req, res) => {
  const { bookId } = req.params;
  const { tags } = req.body;

  try {
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.tags = tags;
    await book.save();

    res.status(200).json({
      message: "Book tags updated successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating book tags",
      error: error.message,
    });
  }
};

exports.deletebook = async (req, res) => {
  const { bookId } = req.params;
  console.log(bookId);
  try {
    const book = await Bookschema.findByIdAndDelete(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error deleting book",
      error: error.message,
    });
  }
};

exports.searchBook = async (req, res) => {
  const { search } = req.query;
  console.log(search);
  try {
    const books = await Bookschema.find({
      $text: { $search: search },
      ispublished: true,
    });

    res.status(200).json({
      data: {
        books,
      },
      message: "Books found by search term",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error searching books",
      error: error.message,
    });
  }
};

exports.getBookByAuthor = async (req, res) => {
  const { author } = req.params;

  try {
    const books = await Bookschema.find({ author });

    res.status(200).json({
      data: {
        books,
      },
      message: "Books by author",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching books by author",
      error: error.message,
    });
  }
};
exports.getBookByUser = async (req, res) => {
  const userId = req.user._id;

  try {
    console.log(userId);
    const books = await Bookschema.find({ createdby: userId });

    res.status(200).json({
      books,
      message: "Books created by user",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error while fetching your book",
      error: error.message,
    });
  }
};
