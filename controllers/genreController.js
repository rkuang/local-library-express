var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator')

module.exports = {
  // Display list of all Genre.
  genre_list: function (req, res, next) {
    Genre.find()
      .sort([['name', 'asc']])
      .exec((err, result) => {
        if (err) return next(err);

        res.render('genre_list', {
          title: 'Genre List',
          genre_list: result,
        });
      });
  },

  // Display detail page for a specific Genre.
  genre_detail: function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      var err = new Error('Bad Request');
      err.status = 400;
      return next(err);
    }
    async.parallel({
      genre: function(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: function(callback) {
        Book.find({ 'genre': req.params.id }).exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      if (results.genre == null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    });
  },

  // Display Genre create form on GET.
  genre_create_get: function (req, res, next) {
    res.render('genre_form', { title: 'Create Genre' })
  },

  // Handle Genre create on POST.
  genre_create_post: [
    body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      var genre = new Genre(
        { name: req.body.name }
      );
      if (!errors.isEmpty()) {
        res.render('genre_form', {
          title: 'Create Genre',
          genre: genre,
          errors: errors.array()
        });
      } else {
        Genre.findOne({ 'name': req.body.name })
          .exec( (err, result) => {
            if (err) return next(err);
            if (result) {
              res.redirect(result.url);
            } else {
              genre.save((err) => {
                if (err) return next(err);
                res.redirect(genre.url);
              });
            }
          });
      }
    }
  ],

  // Display Genre delete form on GET.
  genre_delete_get: function (req, res, next) {
    async.parallel( {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      if (results.genre == null) {
        res.redirect('/catalog/genres');
      }
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        genre_books: results.genre_books
      })
    })
  },

  // Handle Genre delete on POST.
  genre_delete_post: function (req, res, next) {
    async.parallel( {
      genre: (callback) => {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: (callback) => {
        Book.find({ genre: req.params.id }).exec(callback);
      }
    }, (err, results) => {
      if (err) return next(err);
      if (results.genre_books > 0) {
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_books: results.genre_books
        })
      } else {
        Genre.findByIdAndDelete(results.genre._id, (err) => {
          if (err) return next(err);
          res.redirect('/catalog/genres')
        })
      }
    })
  },

  // Display Genre update form on GET.
  genre_update_get: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update GET');
  },

  // Handle Genre update on POST.
  genre_update_post: function (req, res, next) {
    res.send('NOT IMPLEMENTED: Genre update POST');
  },
}
