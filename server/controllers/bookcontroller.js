const Bookschema = require('./../models/bookmodel')
const dotenv = require('dotenv');
dotenv.config({ path: './../config.env' });

exports.getallbook = async (req,res) =>{
    try{
        const books  = await Bookschema.find();
        res.status(200).json({
            data:{
                books: books
            },
            messege:"all books found"
        })
    }
    catch(err){
        return res.status(500).json({
            status: 'error',
            message: "Error While fetching books",
            error: err
        })
    }
}

exports.createbook = async (req,res) =>{
    try{
        const newBook = await Bookschema.create(req.body);
        res.status(200).json({
            data:{
                books: newBook
            },
            messege:"book created"
        })
    }
    catch (err){
        return res.status(500).json({
            status: 'error',
            message: "Error While creating books",
            error: err
        })
    }
}

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
        const filteredTags = [...listmap]
            .filter(([tag, count]) => count > 0)

        res.status(200).json({
            data: {
                tags: filteredTags
            },
            message: "Tags retrieved successfully"
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: "Error while retrieving tags",
            error: err.message
        });
    }
};
exports.updatebookcontent = async (req, res) => {
    const { bookId } = req.params; 
    const { chapters } = req.body; 

    try {
        const book = await Bookschema.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.chapters = chapters;
        await book.save();

        res.status(200).json({
            message: 'Book content updated successfully',
            data: {
                book
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating book content',
            error: error.message 
        });
    }
};

exports.updatebooktype = async (req, res) => {
    const { bookId } = req.params;
    const { booktype } = req.body;

    try {
        const book = await Bookschema.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.booktype = booktype;
        await book.save();

        res.status(200).json({
            message: 'Book type updated successfully',
            data: {
                book
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating book type',
            error: error.message
        });
    }
};

exports.updatebookimg = async (req, res) => {
    const { bookId } = req.params; 
    const { imageUrl } = req.body; 

    try {
        const book = await Bookschema.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.image = imageUrl;
        await book.save();

        res.status(200).json({
            message: 'Book image updated successfully',
            data: {
                book
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating book image',
            error: error.message
        });
    }
};

exports.updatebooktags = async (req, res) => {
    const { bookId } = req.params; 
    const { tags } = req.body; 

    try {
        const book = await Bookschema.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.tags = tags;
        await book.save();

        res.status(200).json({
            message: 'Book tags updated successfully',
            data: {
                book
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating book tags',
            error: error.message
        });
    }
}

exports.deletebook = async (req, res) => {
    const { bookId } = req.params;

    try {
        const book = await Bookschema.findByIdAndDelete(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({
            message: 'Book deleted successfully',
            data: {
                book
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting book',
            error: error.message
        });
    }
}

exports.searchBook = async (req, res) => {
    const { searchTerm } = req.query;

    try {
        const books = await Bookschema.find({
            $text: { $search: searchTerm }
        });

        res.status(200).json({
            data: {
                books
            },
            message: 'Books found by search term'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error searching books',
            error: error.message
        });
    }
}

exports.getBookByAuthor = async (req, res) => {
    const { author } = req.params;

    try {
        const books = await Bookschema.find({ author });

        res.status(200).json({
            data: {
                books
            },
            message: 'Books by author'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching books by author',
            error: error.message
        });
    }
}

