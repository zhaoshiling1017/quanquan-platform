var express = require('express');
var config = require('./config');
var home = require('./controllers/home');
var path = require('path');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.upload.path)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0] + '-' + Date.now() + path.extname(file.originalname));
  }
})
var upload_voice = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    if(file.mimetype!=='audio/wav'){
      cb(null, false)
    }else{
      cb(null, true)
    }
  }
});

var router = express.Router();

router.get('/', home.index);

module.exports = router;
