"use strict";

var express = require('express');
var app = express();
var http = require('http');
var cors = require('cors');
var os = require('os');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var persons = require('./routes/persons');
var users = require('./routes/users');
var booking = require('./routes/booking');
var info = require('./routes/info');
var model = require('./models/model');
var chatServer = require('./chatServer');


app.set('port', (process.env.PORT || 5000));
app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(users);     //returns router to handle user requests
app.use(booking);     //returns router to handle user requests
app.use(persons);
app.use(info);

var server = http.createServer(app);
var io = require('socket.io')(server);

/*
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

var uri = process.env.ATLAS_URI;
logger.info('uri:', uri);
model.initDb(uri, function(err, db){
  if (err) {
    logger.error(err);
  }
  else {
    model.initMgDb(uri, function(err, db){
      if (err) {
        logger.error(err);
      }
      else {
        chatServer.initModule(io);
        server.listen(app.get('port'), function() {
          console.log("Node app is running at " + os.hostname() +':' + app.get('port'));
          console.log('run grunt build_local to use local services');
          console.log('run grunt build_dev to use heroku services');
        });
      }
    });
  }
});

module.exports = app;
