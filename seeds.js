const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI;
const Book = require("./app/model/books");

mongoose
  .connect(uri)
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log(err, "CONNECTION FAILED!!");
  });

// const bookHarryPotter = new Book({
//   name: "Harry Potter and the Philosopher's Stone",
//   author: "J.K. Rowling",
// });
// bookHarryPotter
//   .save()
//   .then((bookHP) => {
//     console.log(bookHP);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

const seedBooks = [
  { name: "Percy Jackson and The Lightning Thief", author: "Rick Riordan" },
  { name: "A Song of Fire and Ice", author: "George R. R. Martin" },
  {
    name: "The Lord of the Rings: The Fellowship of the Ring",
    author: "J. R. R. Tolkien",
  },
  { name: "Animorphs", author: "K. A. Applegate" },
];

Book.insertMany(seedBooks)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
