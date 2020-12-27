const express = require("express");
const bodyParser = require("body-parser");
const gTTs = require("gtts");
const fs = require("fs");

const app = express();

// Engine
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.static("/public"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

const languages = require("./languages");

app.get("/", (req, res) => {
  res.render("index", { languages });
});

app.get("/convertText", (req, res) => {
  const { textInput, languageText } = req.query;

  if (textInput) {
    const gtts = new gTTs(textInput, languageText);
    const outputFile = Date.now() + "ktMark.mp3";

    gtts.save(outputFile, (err, result) => {
      if (err) {
        fs.unlinkSync(outputFile);
        res.send("Unable to convert");
      }
      res.download(outputFile, (err) => {
        fs.unlinkSync(outputFile);
      });
    });
  } else {
    res.send("<h1>Please Input Fields</h1>");
  }
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening to PORT: ${PORT}`);
});
