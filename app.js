const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const wikiSchema = {
  title: String,
  content: String
};

const Wiki = mongoose.model("Article", wikiSchema);

app
  .route("/articles")
  .get(function(req, res) {
    Wiki.find({}, function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        console.log(err);
      }
    });
  })
  .post(function(req, res) {
    const article1 = new Wiki({
      title: req.body.title,
      content: req.body.content
    });
    article1.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Wiki.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

// ------------------------------------------------------------

app
  .route("/articles/:articleTitle")

  .get(function(req, res) {
    Wiki.findOne({ title: req.params.articleTitle }, function(
      err,
      foundArticle
    ) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .put(function(req, res) {
    Wiki.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function(err) {
        if (!err) {
          res.send("Successfully updated an article");
        }
      }
    );
  })
  .patch((req, res) => {
    Wiki.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function(err) {
        if (!err) {
          res.send("Successfully patched an article");
        }
      }
    );
  })
  .delete((req, res) => {
    Wiki.deleteOne({ title: req.params.articleTitle }, err => {
      if (!err) {
        res.send("Successfully delete a article");
      }
    });
  });

app.listen(3000, () => {
  console.log("Server has started");
});
