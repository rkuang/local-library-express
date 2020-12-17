var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');

var async = require('async');

module.exports = {
  index: function (req, res) {
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
  book_create_get: function (req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
  },

  // Handle book create on POST.
  book_create_post: function (req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
  },

  // Display book delete form on GET.
  book_delete_get: function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
  },

  // Handle book delete on POST.
  book_delete_post: function (req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
  },

  // Display book update form on GET.
  book_update_get: function (req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
  },

  // Handle book update on POST.
  book_update_post: function (req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
  },
}
