const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon')
const i18n = require('i18n');

global.__repo = "imageframe";
global.__owner = "zMoooooritz";

if (process.env.NODE_ENV === 'development') {
    global.__projectBase = path.resolve(__dirname);
    global.__dataBase = path.join(os.homedir(), "imageframe");
} else {
    global.__projectBase = path.resolve(__dirname);
    global.__dataBase = os.homedir();
}

const config = require('./util/config');
const scheduler = require('./util/scheduler');

const indexRouter = require('./routes/index');
const imageRouter = require('./routes/image');
const directoryRouter = require('./routes/directory');
const slideRouter = require('./routes/slide');
const screenRouter = require('./routes/screen');
const powerRouter = require('./routes/power');
const automationRouter = require('./routes/automation');
const softwareRouter = require('./routes/software');

var app = express();

i18n.configure({
    locales: ['en', 'de'],
    directory: path.join(__dirname, 'locales'),
    register: global,
})

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
app.use('/assets/vendor/bootstrap/js', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js')));
app.use('/assets/vendor/bootstrap/css', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));
app.use('/assets/vendor/jquery', express.static(
    path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use('/assets/vendor/bootstrap/css', express.static(
    path.join(__dirname, 'node_modules', 'bootstrap-icons', 'font')));
app.use('/assets/vendor/viewerjs', express.static(
    path.join(__dirname, 'node_modules', 'viewerjs', 'dist')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.svg')));
app.use(i18n.init);

app.use('/', indexRouter);
app.use('/slide', slideRouter);
app.use('/image', imageRouter);
app.use('/directory', directoryRouter);
app.use('/screen', screenRouter);
app.use('/power', powerRouter);
app.use('/automation', automationRouter);
app.use('/software', softwareRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: res.__('Error') });
});

(async() => {
    await scheduler.init();
})();

module.exports = app;
