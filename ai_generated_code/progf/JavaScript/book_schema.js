const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publicationDate: Date,
    genre: String,
    pageCount: Number,
    publisher: String
});

const Book = mongoose.model("Book", bookSchema);
Book.watch().on("change", data => console.log(new Date(), data));

module.exports = Book;

//Built using basic development resources 4