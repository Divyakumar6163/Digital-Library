const Bookschema = require("../../models/bookmodel");
const dotenv = require("dotenv");
const userSchema = require("../../models/usermodel");
const JWT = require("jsonwebtoken");
dotenv.config({ path: "./../config.env" });
const { promisify } = require("util");
const addcollaboratoremail = require("../../utils/mails/addcollaboratoremail");
const client = require("./../../redis");
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
    const bookId = req.params.bookId;
    // await client.connect()
    // const cachedBook = await client.get(`book:${bookId}`);
    // if (cachedBook) {
    //   return res.status(200).json({
    //     data: {
    //       book: JSON.parse(cachedBook),
    //     },
    //     messege: "book found (from cache)",
    //   });
    // }
    const book = await Bookschema.findById(bookId);
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "book not found",
      });
    }
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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
      error: err.message,
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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
    // book.collaborators = data.collaborators;
    // book.coAuthors = data.coAuthors;
    // book.reviewers = data.reviewers;
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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

exports.sendcollaboratorrequest = async (req, res) => {
  try {
    // console.log("hii")
    const emailarr = req.body.emails;
    const user = req.user;
    const book = await Bookschema.findById(req.body.bookid);
    const currcollab = book.collaborators;
    const filteredEmails = emailarr.filter(
      (email) => !currcollab.includes(email)
    );
    const totalemails = filteredEmails.length;
    for (let i = 0; i < totalemails; i++) {
      const InviteLink = JWT.sign(
        { bookid: req.body.bookid, userId: filteredEmails[i] },
        process.env.ACCESS_JWT_SECRET,
        {
          expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
        }
      );
      const link = `${process.env.FRONT_END_LINK}/addcollaborator/${InviteLink}`;
      console.log(link);
      await addcollaboratoremail({
        email: filteredEmails[i],
        subject: "Invitation for Collaboration",
        name: user.name,
        inviteLink: link,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Invitations sent successfully!",
      data: {
        booktitle: book.booktitle,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error while sending invitations",
      error: err.message,
    });
  }
};

exports.acceptcollabInvitation = async (req, res) => {
  try {
    const decoded = await promisify(JWT.verify)(
      req.body.InviteLink,
      process.env.ACCESS_JWT_SECRET
    );
    console.log(decoded);
    const book = await Bookschema.findById(decoded.bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const usermail = decoded.userId;
    if (book.collaborators.includes(usermail)) {
      return res
        .status(400)
        .json({ message: "User already collaborating with the book" });
    }
    book.collaborators.push(usermail);
    // await client.set(
    //   `book:${decoded.bookid}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
    await book.save();
    res.status(200).json({
      status: "success",
      message: "Invitation accepted",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error while accepting invitation",
      error: err.message,
    });
  }
};

exports.removecollab = async (req, res) => {
  try {
    const mail = req.body.mailId;
    const bookId = req.body.bookid;

    const book = await Bookschema.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.collaborators.includes(mail)) {
      return res
        .status(404)
        .json({ message: "Collaborator not found in this book" });
    }

    book.collaborators = book.collaborators.filter((collab) => collab !== mail);
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
    await book.save();

    return res.status(200).json({
      message: "Collaborator removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Error while removing collaborator",
      error: err.message,
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
    await book.save();
    const newbook = await Bookschema.findById(bookId);
    res.status(200).json({
      message: "Book content updated successfully",
      data: {
        newbook,
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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
    // await client.set(
    //   `book:${bookId}`,
    //   JSON.stringify(book),
    //   "EX",
    //   3600
    // );
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
  const userEmail = req.user.emailid;
  try {
    // console.log(req.user.emailid);
    const books = await Bookschema.find({ createdby: userId });
    const coAuthor = await Bookschema.find({
      coAuthors: userEmail, // Match the emailid inside coAuthors
    });
    const collaborator = await Bookschema.find({
      collaborators: userEmail, // Match the email directly in the array
    });
    const reviewer = await Bookschema.find({
      reviewers: userEmail, // Match the email directly in the array
    });
    console.log(coAuthor);
    console.log(collaborator);
    console.log(reviewer);
    res.status(200).json({
      books,
      coAuthorBooks: coAuthor,
      collaboratorBooks: collaborator,
      reviewerBooks: reviewer,
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
exports.getbookinfo = async (req, res) => {
  try {
    const decoded = await promisify(JWT.verify)(
      req.body.InviteLink,
      process.env.ACCESS_JWT_SECRET
    );
    console.log(decoded);
    const book = await Bookschema.findById(decoded.bookid);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    console.log(book.booktitle);
    res.status(200).json({
      booktitle: book.booktitle,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error while sending reviewer invitations",
      error: err.message,
    });
  }
};
