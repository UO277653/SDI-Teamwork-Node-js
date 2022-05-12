var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.twig', { title: 'Express' , session:req.session.user});
});

module.exports = router;
