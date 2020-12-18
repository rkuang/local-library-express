var Author = require('../models/author');
var async = require('async');
const book = require('../models/book');
const { body, validationResult } = require('express-validator');
const author = require('../models/author');
const mongoose = require('mongoose');

module.exports = {
  // Display list of all Authors
  author_list: function(req, res, next) {
    Author.find()
      .sort([['last_name', 'ascending'], ['first_name', 'ascending']])
      .exec((err, result) => {
        if (err) { return next(err) };

        res.render('author_list', {
          title: 'Author List',
          author_list: result
        })
      })
  },

  // Display detail page for a specific Author
  author_detail: function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    async.parallel({
      author: (callback) => {
        Author.findById(req.params.id)
          .exec(callback);
      },
      author_books: (callback) => {
        book.find({ 'author': req.params.id }, 'title summary').exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      if (results.author == null) {
        var err = new Error('Author not found')
        err.status = 404;
        return next(err);
      }
      res.render('author_detail', {
        title: results.author.name,
        author: results.author,
        author_books: results.author_books
      })
    })
  },
  
  // Display Author create form on GET
  author_create_get: function(req, res, next) {
    res.render('author_form', {
      title: 'Create Author'
    });
  },

  // Handle Author create on POST
  author_create_post: [
    body('first_name').trim()
      .isLength({ min: 1 }).escape().withMessage('First name cannot be empty.')
      .isAlphanumeric().withMessage('First name contains non-alphanumeric characters.'),
    body('last_name').trim()
      .isLength({ min: 1 }).escape().withMessage('Last name cannot be empty.')
      .isAlphanumeric().withMessage('Last name conatins non-alphanumeric characters.'),
    body('birth_date').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('death_date').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        res.render('author_form', {
          title: 'Create Author',
          author: req.body,
          errors: errors.array()
        });
      } else {
        var author = new Author(
          {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            birth_date: req.body.birth_date,
            death_date: req.body.death_date,
          });
        author.save((err) => {
          if (err) return next(err);
          res.redirect(author.url);
        })
      }
    }
  ],

  // Display Author delete form on GET
  author_delete_get: function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author delete GET');
  },

  // Handle Author delete on POST
  author_delete_post: function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author delete POST');
  },

  // Display Author update form on GET
  author_update_get: function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author update GET');
  },

  // Display Author update form on POST
  author_update_post: function(req, res, next) {
    res.send('NOT IMPLEMENTED: Author update POST');
  }
};
