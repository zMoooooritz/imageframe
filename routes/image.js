const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const config = require('../util/config');
const storage = require('../util/storage');

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.getTmpImagePath());
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
});

function fileFilter(req, file, cb) {
    var ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter
});

router.get('/', async function(req, res) {
    res.locals = {
        dirs: storage.listContainers(),
        imgs: JSON.stringify(storage.buildImageMap()),
    };

    res.render('image', { title: res.__('Images') });
});

router.get('/list/:container', function(req, res) {
    const { container } = req.params;

    res.json(storage.listImages(container));
});

router.use('/view', express.static(config.getContainersPath()));

router.post('/upload', upload.array('fimgn'), async function(req, res) {
    await storage.fixAndMove(req.body.fdirn);

    res.redirect('/image')
});

router.post('/delete', upload.none(), function(req, res) {
    var dir = req.body.fdird;
    var imgs = req.body.fimgd;
    if (typeof imgs === 'string') {
        imgs = [imgs];
    }

    storage.deleteImages(dir, imgs)

    res.redirect('/image')
});

module.exports = router;
