var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var members = require('./routes/members');
var users = require('./routes/users');
var model = require('./model');

app.set('port', (process.env.PORT || 5000));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', members.isAlive);
app.get('/isAlive', members.isAlive);
app.get('/members', members.listMembers);
app.get('/members/:oid', members.getMember);

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

var uri = process.env.MONGOLAB_URI;
logger.info('uri:', uri)
model.initDb(uri, function(err, db){
  app.listen(app.get('port'), function() {
    console.log("Node app is running at ??:" + app.get('port'));
  });
});

module.exports = app;
