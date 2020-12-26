const express = require('express');
const bodyParser = require('body-parser');
const gTTs = require('gtts');
const fs = require('fs');

const app = express();

// Engine
app.set('view engine', 'ejs')

// Middleware
app.use(express.json());
app.use(express.static('/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/convertText', (req, res) => {
  const {
    textInput
  } = req.query;

  const gtts = new gTTs(textInput,
    'en');
  const outputFile = Date.now() + 'ktMark.mp3';

  gtts.save(outputFile,
    function (err, result) {
      if (err) {
        fs.unlinkSync(outputFile);
        res.send('Unable to convert');
      }
      res.download(outputFile, (err) => {
        fs.unlinkSync(outputFile)
      })
    });
})

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Listening to PORT: ${PORT}`)
})