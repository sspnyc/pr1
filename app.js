var express = require('express');
var sqlite3 = require('sqlite3');
var fs = require('fs');
var Mustache = require('mustache');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var marked = require('marked');
var request = require('request');
var db = new sqlite3.Database('./topic.db');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
  //store req.ip in variable
  console.log(req.connection.remoteAddress);
  res.send(fs.readFileSync('./views/index.html', 'utf8'));
});

app.post('/topic/info', function(req, res){
  console.log(req.body);
  request.get('http://ipinfo.io/json', function(err, res, body){
    var parseBody = JSON.parse(body);

    console.log(parseBody);
    db.run("INSERT INTO topics (location, title, description, votes) VALUES ('"+parseBody.region+"', '"+req.body.title+"','" + req.body.description + "',0 );");
  
  });
  res.redirect('/topic');
});

app.get('/topic', function(req, res) {
  var template = fs.readFileSync('./views/topic.html', 'utf8');

  db.all('SELECT * FROM topics;', function(err, topic) {
    var html = Mustache.render(template, {topicList: topic});
    res.send(html);
  });
});

// app.get('/comment', function(req, res) {
//   var template = fs.readFileSync('./views/comment.html', 'utf8');

//   db.all('SELECT * FROM comments;', function(err, comment) {
//     var html = Mustache.render(template, {withComment: comment});
//     res.send(html);
//   });
// });

app.get('/topic/:id', function(req, res){
  var id = req.params.id;
  db.all("SELECT * FROM topics WHERE id = " + id + ";", {}, function(err, topicNo){
    fs.readFile('./views/show.html', 'utf8', function(err, html){
      // console.log(topic);
      var renderedHTML = Mustache.render(html, topicNo[0]);
      res.send(marked(renderedHTML));
    });
  });
});


app.delete('/topic/:id', function(req, res){
  var id = req.params.id;
  db.run("DELETE FROM topics WHERE id = " + id + ";");
  res.redirect("/topic");
});

// app.put('/topic/:id', function(req, res){
//   var id = req.params.id;
//   var topicInfo = req.body;
//   db.run("UPDATE topics SET title =  '"+ topicInfo.title + "' , description = '" + topicInfo.description + "' WHERE id = " + id + ";");
//   res.redirect('/topic');
// });

app.put('/topic/:id', function(req, res){
  var id = req.params.id;
  var topicInfo = req.body;
  db.run("UPDATE comments SET content =  '"+ topicInfo.content + "' WHERE topic_id = " + id + ";");
  res.redirect('/topic');
});

app.listen(3000, function() {
  console.log("LISTENING!");
});