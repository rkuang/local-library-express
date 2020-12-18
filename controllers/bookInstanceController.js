var BookInstance = require('../models/bookInstance');
var async = require('async');
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const book = require('../models/book');

module.exports = {
  // Display list of all BookInstances.
  book_instance_list: function (req, res, next) {
    BookInstance.find()
      .populate('book')
      .exec((err, list_book_instances) => {
        if (err) {
          return next(err)
        };
        res.render('book_instance_list', {
          title: 'Book Instance List',
          book_instance_list: list_book_instances
        });
      });
  },

  // Display detail page for a specific BookInstance.
  book_instance_detail: function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    BookInstance.findById(req.params.id)
      .populate('book')
      .exec((err, result) => {
        if (err) return next(err);
        if (result == null) {
          var err = new Error('Book Instance not found');
          err.status = 404;
          return next(err);
        }
        res.render('book_instance_detail', {
          title: 'Copy: ' + result.book.title,
          bookinstance: result
        });
      });
  },

  // Display BookInstance create form on GET.
  book_instance_create_get: function (req, res, next) {
    book.find({}, 'title').sort([['title', 'asc']])
      .exec((err, result) => {
        if (err) return next(err);
        res.render('book_instance_form', {
          title: 'Create Book Instance',
          book_list: result
        })
      })
  },

  // Handle BookInstance create on POST.
  book_instance_create_post: [
    body('book', 'Book cannot be empty.').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint cannot be empty').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date.').optional({ checkFalsy: true}).isISO8601().toDate(),
    (req, res, next) => {
      const errors = validationResult(req);
      var bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      });
      if (!errors.isEmpty()) {
        book.find({}, 'title').sort([['title', 'asc']])
          .exec((err, result) => {
            if (err) return next(err);
            res.render('book_instance_form', {
              title: 'Create Book Instance',
              book_list: result,
              bookinstance: bookInstance,
              selected_book: bookInsance.book,
              errors: errors.array()
            })
          });
          return;
      } else {
        bookInstance.save((err) => {
          if (err) return next(err);
          res.redirect(bookInstance.url);
        })
      }
    }
  ],

  // Display BookInstance delete form on GET.
  book_instance_delete_get: function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    BookInstance.findById(req.params.id)
      .populate('book')
      .exec((err, result) => {
        if (err) return next(err);
        if (result == null) {
          var err = new Error('Book Instance not found');
          err.status = 404;
          return next(err);
        }
        res.render('book_instance_delete', {
          title: 'Copy: ' + result.book.title,
          bookinstance: result
        });
      });
  },

  // Handle BookInstance delete on POST.
  book_instance_delete_post: function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    BookInstance.findByIdAndDelete(req.params.id, (err, result) => {
      if (err) return next(err);
      res.redirect('/catalog/book/'+result.book._id);
    });
  },

  // Display BookInstance update form on GET.
  book_instance_update_get: function (req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
  },

  // Handle bookinstance update on POST.
  book_instance_update_post: function (req, res, next) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
  },
}
