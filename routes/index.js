var express = require('express');
var router = express.Router();

const fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/words", (req, res) => {

  fs.readFile('allowed_words.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file: ' + err);
      return;
    }
    res.send(data);
  });
})



module.exports = router;
