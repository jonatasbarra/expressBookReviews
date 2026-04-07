const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user." });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Task 3: Get book details based on author
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

// Task 4: Get all books based on title
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

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

/*
  Tasks 10–13
  Promise callbacks or async/await with Axios
*/

const axios = require('axios');

// Task 10 - Promise callback with Axios
const getAllBooks = () => {
  return axios.get('http://localhost:5000/')
    .then((response) => response.data)
    .catch((error) => {
      throw new Error('Unable to fetch books');
    });
};

// Task 11 - Async/Await with Axios
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    if (!response.data) {
      throw new Error('Book not found');
    }
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch book by ISBN');
  }
};

// Task 12 - Promise callback with Axios
const getBooksByAuthor = (author) => {
  return axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then((response) => {
      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error('Books by author not found');
      }
      return response.data;
    })
    .catch((error) => {
      throw new Error('Unable to fetch books by author');
    });
};

// Task 13 - Async/Await with Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error('Books by title not found');
    }
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch books by title');
  }
};

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;