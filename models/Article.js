var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: false
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
