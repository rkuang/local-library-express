var BookInstance = require('../models/bookInstance');
var async = require('async');
var mongoose = require('mongoose');

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
  book_instance_create_get: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
  },

  // Handle BookInstance create on POST.
  book_instance_create_post: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
  },

  // Display BookInstance delete form on GET.
  book_instance_delete_get: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
  },

  // Handle BookInstance delete on POST.
  book_instance_delete_post: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
  },

  // Display BookInstance update form on GET.
  book_instance_update_get: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
  },

  // Handle bookinstance update on POST.
  book_instance_update_post: function (req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
  },
}
