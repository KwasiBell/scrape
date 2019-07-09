var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
// var routes = require("./routes");//html routes, api routes
//localhost:3000/api/article
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// app.use(routes);
// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// Routes
app.get("/", function(req, res){
  console.log("walla");

  db.Article.find()
      // Throw any errors to the console
      .then(function(dbPopulate) {
        var result = {data : dbPopulate};
        // console.log(dbPopulate);
        // If any Libraries are found, send them to the client with any associated Books
        // res.json(dbPopulate);
        res.render("index", result);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });

})
// A GET route for scraping the WSJ  website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.wsj.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".lead-story h3").each(function(i, element) {
      // Save an empty result object
      var result = {};
      // var results = {data:[]};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          //  results.data.push(result);
          // View the added result in the console
          console.log(result);

        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);

        });
    });

    // Send a message to the client
    res.send("Scrape Complete!");
    // res.render("index", results);
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    // Find all results from the scrapedData collection in the db
    db.Article.find()
      // Throw any errors to the console
      .then(function(dbPopulate) {
        // If any Libraries are found, send them to the client with any associated Books
        res.json(dbPopulate);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });





    });

//save article
app.post("/save_article", function(req, res){
//do stuff send article _id

//eigther update existing article table, set value true /false to figure out this article is saved or not
//or
//create new table called 'saved_article' to keep track of saved article

Article
.find({})
.where('saved').equals(true)
.where('deleted').equals(false)
.populate('notes')
.sort('-date')
.exec(function(error, articles) {
    if (error) {
        console.log(error);
        res.status(500);
    } else {
        console.log(articles);
        let hbsObj = {
            title: 'All the News That\'s Fit to Scrape',
            subtitle: 'Saved Hacker News',
            articles: articles
        };
        res.render("saved" ,hbsObj);
    }
});
})
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findById(req.params.id)
  .populate("note")
  .then(function(dbPopulate) {
    // If any Libraries are found, send them to the client with any associated Books
    res.json(dbPopulate);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  // db.Note.create(req.body)
  //   .then(function(dbPopulate) {

  //     return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { note: dbPopulate._id } }, { new: true });
  //   })
  //   .then(function(dbPopulate) {
  //     // If the Library was updated successfully, send it back to the client
  //     res.json(dbPopulate);
  //   })
  //   .catch(function(err) {
  //     // If an error occurs, send it back to the client
  //     res.json(err);
  //   });
  Article.findByIdAndUpdate(req.params.id, {
    $set: { saved: true}
    },
    { new: true },
    function(error, doc) {
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            res.redirect('/');
        }
    });
  });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
