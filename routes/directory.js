const express = require('express');
const multer = require('multer');
const router = express.Router();
const storage = require('../util/storage');

const upload = multer();

router.get('/', async function(req, res) {
    res.locals = {
        dirs: storage.listContainers(),
    };

    res.render('directory', { title: res.__('Directories') });
});

router.get('/list', function(req, res) {
    res.json(storage.listContainers());
});

router.post('/create', upload.none(), function(req, res) {
    storage.createContainer(req.body.fcreatedir);

    res.redirect('/directory')
});

router.post('/rename', upload.none(), function(req, res) {
    storage.renameContainer(req.body.folddir, req.body.fnewdir);

    res.redirect('/directory')
});

router.post('/delete', upload.none(), function(req, res) {
    storage.deleteContainer(req.body.fdeldir);
    
    res.redirect('/directory')
});

module.exports = router;
