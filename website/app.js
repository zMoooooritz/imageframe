const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./util/config');
const schedule = require('./util/schedule');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon')

const indexRouter = require('./routes/index');
const imageRouter = require('./routes/image');
const directoryRouter = require('./routes/directory');
const slideRouter = require('./routes/slide');
const screenRouter = require('./routes/screen');
const powerRouter = require('./routes/power');
const updateRouter = require('./routes/update');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// directory structure setup
fs.mkdirSync(config.getContainersPath(), { recursive: true });
fs.mkdirSync(config.getTmpImagePath(), { recursive: true });
fs.mkdirSync(config.getSettingsPath(), { recursive: true });

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
app.use('/screen/dailyschedule', screenRouter);
app.use('/screen/holidayschedule', screenRouter);
app.use('/screen/noschedule', screenRouter);
app.use('/power', powerRouter);
app.use('/power/off', powerRouter);
app.use('/power/reboot', powerRouter);
app.use('/update', updateRouter);
app.use('/update/software', updateRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: 'Fehler' });
});

(async() => {
    schedule.init();
})();

module.exports = app;
