var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');

var async = require('async');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

module.exports = {
  index: function (req, res, next) {
    async.parallel({
      book_count: function (callback) {
        Book.countDocuments({}, callback);
      },
      book_instance_count: function (callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function (callback) {
        BookInstance.countDocuments({
          status: 'Available'
        }, callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      }
    }, function (err, results) {
      res.render('index', {
        title: 'Local Library Home',
        error: err,
        data: results
      });
    });
  },

  // Display list of all books.
  book_list: function (req, res, next) {
    Book.find({}, 'title author')
      .populate('author')
      .exec(function (err, list_books) {
        if (err) { return next(err); }

        res.render('book_list', {title: 'Book List', book_list: list_books});
      })
  },

  // Display detail page for a specific book.
  book_detail: function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    async.parallel({
      book: function(callback) {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      book_instance_list: function(callback) {
        BookInstance.find({ 'book': req.params.id })
          .exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      if (results.book == null) {
        var err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      res.render('book_detail', {
        title: results.book.title,
        book: results.book,
        book_instances: results.book_instance_list
      })
    });
  },

  // Display book create form on GET.
  book_create_get: function (req, res, next) {
    async.parallel({
      authors: (callback) => {
        Author.find().sort([['last_name', 'asc'], ['first_name', 'asc']])
          .exec(callback);
      },
      genres: (callback) => {
        Genre.find().sort([['name', 'asc']]).exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      res.render('book_form', {
        title: 'Create Book',
        authors: results.authors,
        genres: results.genres,
      });
    })
  },

  // Handle book create on POST.
  book_create_post: [
    (req, res, next) => {
      if (!(req.body.genre instanceof Array)) {
        typeof req.body.genre === 'undefined' ? req.body.genre = [] : req.body.genre = new Array(req.body.genre);
      }
      next();
    },
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      })
      if (!errors.isEmpty()) {
        async.parallel({
          authors: (callback) => {
            Author.find().sort([['last_name', 'asc'], ['first_name', 'asc']])
              .exec(callback);
          },
          genres: (callback) => {
            Genre.find().sort([['name', 'asc']]).exec(callback);
          }
        }, (err, results) => {
          if (err) return next(err);
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked='true';
            }
          }
          res.render('book_form', {
            title: 'Create Book',
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array()
          })
        })
      } else {
        // book.save((err) => {
        //   if (err) return next(err);
        //   res.redirect(book.url);
        // })
        console.log(book);
      }
    }
  ],

  // Display book delete form on GET.
  book_delete_get: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete GET');
  },

  // Handle book delete on POST.
  book_delete_post: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book delete POST');
  },

  // Display book update form on GET.
  book_update_get: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book update GET');
  },

  // Handle book update on POST.
  book_update_post: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Book update POST');
  },
}
