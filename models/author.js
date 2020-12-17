const { DateTime } = require('luxon');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    last_name: {type: String, required: true, maxlength: 100},
    birth_date: {type: Date},
    death_date: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name
});

AuthorSchema
.virtual('birth_date_formatted')
.get(function () {
  return this.birth_date ? DateTime.fromJSDate(this.birth_date).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema
.virtual('death_date_formatted')
.get(function () {
  return this.death_date ? DateTime.fromJSDate(this.death_date).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema
.virtual('lifespan')
.get(function () {
  return (this.death_date.getYear() - this.birth_date.getYear()).toString();
});

AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
