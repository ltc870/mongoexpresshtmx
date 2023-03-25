const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
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

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", async (req, res) => {
  const books = await Book.find({});
  res.render("index", { books });
});

app.post("/submit", async (req, res) => {
  const book = {
    name: req.body.title,
    author: req.body.author,
  };
  await Book.create(book).then((x) => {
    console.log("Created Book!");
    res.send(`<tr>
      <td>${req.body.title}</td>
      <td>${req.body.author}</td>
      <td>
        <button class="btn btn-primary" hx-get="/get-edit-form/${x.null}">Edit Book</button>
      </td>
      <td>
        <button hx-delete="/delete/${x.null}" class="btn btn-primary">Delete</button>
      </td>
    </tr>`);
  });
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findByIdAndDelete(id);
  console.log("Deleted Book!!");
  return res.send("");
});

app.get("/get-book-row/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findById(id).then((book) => {
    console.log(req.body);
    res.send(`<tr>
    <td>${book.name}</td>
    <td>${book.author}</td>
    <td>
      <button class="btn btn-primary" 
        hx-get="/get-edit-form/${id}">
        Edit Book
      </button>
    </td>
    <td>
      <button hx-delete="/delete/${id}" 
        class="btn btn-primary">
        Delete
      </button>
    </td>
  </tr>`);
  });
});

app.get("/get-edit-form/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findById(id).then((book) => {
    res.send(`<tr hx-trigger="cancel" class="editing" hx-get="/get-book-row/${id}">
      <td><input name="title" value="${book.name}"/></td>
      <td><input name="author" value="${book.author}"/></td>
      <td>
        <button class="btn btn-primary" hx-get="/get-book-row/${id}">
          Cancel
        </button>
        <button class="btn btn-primary" hx-put="/update/${id}" hx-include="closest tr">
          Save
        </button>
      </td>
    </tr>`);
  });
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  await Book.updateOne(
    { id },
    { name: req.body.title, author: req.body.author }
  ).then(() => {
    res.send(`<tr>
        <td>${req.body.title}</td>
        <td>${req.body.author}</td>
        <td>
          <button class="btn btn-primary" 
            hx-get="/get-edit-form/${id}">
            Edit Book
          </button>
        </td>
        <td>
          <button hx-delete="/delete/${id}" 
            class="btn btn-primary">
            Delete
          </button>
        </td>
      </tr>`);
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
