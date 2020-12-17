const { nextTick } = require('async');
var Author = require('../models/author');
var async = require('async');
const book = require('../models/book');

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
  author_create_get: function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
  },

  // Handle Author create on POST
  author_create_post: function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
  },

  // Display Author delete form on GET
  author_delete_get: function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
  },

  // Handle Author delete on POST
  author_delete_post: function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
  },

  // Display Author update form on GET
  author_update_get: function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
  },

  // Display Author update form on POST
  author_update_post: function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
  }
};
