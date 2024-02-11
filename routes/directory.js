const express = require('express');
const router = express.Router();
const storage = require('../util/storage');

router.get('/', async function(req, res, next) {
    res.locals = {
        dirs: storage.listContainers(),
    };

    res.render('directory', { title: res.__('Directories') });
});

router.post('/create', function(req, res, next) {
    storage.createContainer(req.body.fcreatedir);

    res.redirect('/directory')
});

router.post('/rename', function(req, res, next) {
    storage.renameContainer(req.body.folddir, req.body.fnewdir);

    res.redirect('/directory')
});

router.post('/delete', function(req, res, next) {
    storage.deleteContainer(req.body.fdeldir);
    
    res.redirect('/directory')
});

module.exports = router;
