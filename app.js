const createError = require('http-errors');
const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const i18n = require('i18n');

global.__repo = "imageframe";
global.__owner = "zMoooooritz";

var i18nConfig = {
    locales: ['en', 'de'],
    fallbacks: { nl: 'de', 'de-*': 'de' },
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
    register: global,
}

global.__projectBase = path.resolve(__dirname);
if (process.env.NODE_ENV === 'development') {
    global.__dataBase = path.join(os.homedir(), global.__repo);
} else {
    global.__dataBase = os.homedir();

    i18nConfig["autoReload"] = true;
    i18nConfig["updateFiles"] = false;
}

const config = require('./util/config');
const scheduler = require('./util/scheduler');
const system = require('./util/system');

const indexRouter = require('./routes/index');
const imageRouter = require('./routes/image');
const directoryRouter = require('./routes/directory');
const slideRouter = require('./routes/slide');
const screenRouter = require('./routes/screen');
const powerRouter = require('./routes/power');
const automationRouter = require('./routes/automation');
const softwareRouter = require('./routes/software');
const logsRouter = require('./routes/logs');
const systemRouter = require('./routes/system');

global.__version = system.getInstalledVersion()

const app = express();

i18n.configure(i18nConfig);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// directory structure setup
fs.mkdirSync(config.getContainersPath(), { recursive: true });
fs.mkdirSync(config.getTmpImagePath(), { recursive: true });
fs.mkdirSync(config.getSettingsPath(), { recursive: true });

if (process.env.NODE_ENV === 'development') {
    var accessLogStream = fs.createWriteStream(config.getLogsPath(), { flags: 'a' })
    app.use(logger('tiny', {
        skip: function(req, res) { return res.statusCode < 400 },
        stream: accessLogStream,
    }));
    app.use(logger('dev'));
} else {
    app.use(logger('tiny', {
        skip: function(req, res) { return res.statusCode < 400 }
    }));
}
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
app.use('/logs', logsRouter);
app.use('/system', systemRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: res.__('Error') });
});

(async() => {
    await scheduler.init();
})();

module.exports = app;
