var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon')

var indexRouter = require('./routes/index');
var startSlideRouter = require('./routes/start_slide');
var startInfoRouter = require('./routes/start_info');
var uploadImagesRoute = require('./routes/upload_images');
var deleteImageRoute = require('./routes/delete_image');
var deleteImagesRoute = require('./routes/delete_images');
var displayOnRoute = require('./routes/display_on');
var displayOffRoute = require('./routes/display_off');
var displayScheduleRoute = require('./routes/display_schedule');
var displayNoscheduleRoute = require('./routes/display_noschedule');
var displayOffRoute = require('./routes/display_off');
var shutdownRaspiRoute = require('./routes/shutdown_raspi');
var rebootRaspiRoute = require('./routes/reboot_raspi');
const serveStatic = require('serve-static');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.svg')));

app.use('/', indexRouter);
app.use('/start_slide', startSlideRouter);
app.use('/start_info', startInfoRouter);
app.use('/upload_images', uploadImagesRoute);
app.use('/delete_image', deleteImageRoute);
app.use('/delete_images', deleteImagesRoute);
app.use('/display_on', displayOnRoute);
app.use('/display_off', displayOffRoute);
app.use('/display_schedule', displayScheduleRoute);
app.use('/display_noschedule', displayNoscheduleRoute);
app.use('/shutdown_raspi', shutdownRaspiRoute);
app.use('/reboot_raspi', rebootRaspiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
