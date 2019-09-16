'use strict';
require('dotenv').config();


var express = require('express');
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
var router = express.Router();
var bodyParser = require('body-parser')
var Url = require("./App");
var logger = require('morgan');
var dns = require('dns');
/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

try {
  var mongo = require('mongodb');
  var mongoose = require('mongoose');
  //mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true })
    mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });

} catch(e) {
  console.log(e);
}




app.use(logger('dev'))
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

// app.use(express.json());
// app.use(express.urlencoded());

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/shorturl/:id", function(req, res) {
  // console.log(req.params.id)
  Url.findOne({short_url: req.params.id}, function(err, data) {
    if(data) {
      // console.log(data)
      res.redirect(data.original_url);
    } else {
      res.json({"error":"No short url"})
    }
  })
})

app.post("/api/shorturl/new", function(req, res, next) {
  
  var url = new Url();  
  const REPLACE_REGEX = /^https?:\/\//i
  
  dns.lookup(req.body.url.replace(REPLACE_REGEX, ''), function(err, addresses) { 
   if (!err){
     Url.findOne({original_url: req.body.url}, function(err, doc){
       if(doc) {
         let alreadyShort = doc.short_url;
         res.json({original_url: req.body.url, short_url: alreadyShort})
       } else {
         url.original_url = req.body.url;     
         url.save(function(err){
           if(err){
             req.flash("erros", err.errors);
           } else{
             // console.log(url)
             res.json({original_url: url.original_url, short_url:url.short_url})
           }
         })
       }
     })
   } else {
     res.json({"error":"invalid URL"})
   }
  })
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});

