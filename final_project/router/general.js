const express = require('express');
const public_users = express.Router();

let books = require("./booksdb.js");
let { isValid, users } = require("./auth_users.js");

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json(book);
});

// Task 3: Get books based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.keys(books)
    .filter(key => books[key].author.toLowerCase() === author.toLowerCase())
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Task 4: Get books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.keys(books)
    .filter(key => books[key].title.toLowerCase() === title.toLowerCase())
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});

  return res.status(200).json(filteredBooks);
});

// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// Task 6: Register a new user
public_users.post('/register', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

module.exports.general = public_users;