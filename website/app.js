var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon')

var indexRouter = require('./routes/index');
var imageRouter = require('./routes/image');
var directoryRouter = require('./routes/directory');
var slideRouter = require('./routes/slide');
var infoRouter = require('./routes/info');
var screenRouter = require('./routes/screen');
var powerRouter = require('./routes/power');
var updateRouter = require('./routes/update');

var app = express();

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
app.use('/slide', slideRouter);
app.use('/slide/start', slideRouter);
app.use('/info', infoRouter);
app.use('/info/start', infoRouter);
app.use('/image', imageRouter);
app.use('/image/upload', imageRouter);
app.use('/image/delete', imageRouter);
app.use('/directory', directoryRouter);
app.use('/directory/create', directoryRouter);
app.use('/directory/rename', directoryRouter);
app.use('/directory/delete', directoryRouter);
app.use('/screen', screenRouter);
app.use('/screen/on', screenRouter);
app.use('/screen/off', screenRouter);
app.use('/screen/schedule', screenRouter);
app.use('/screen/noschedule', screenRouter);
app.use('/power/off', powerRouter);
app.use('/power/reboot', powerRouter);
app.use('/update', updateRouter);
app.use('/update/software', updateRouter);
app.use('/update/system', updateRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: 'Fehler' });
});

module.exports = app;
