const Bookschema = require('./../models/bookmodel')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const crypto = require('crypto')
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
