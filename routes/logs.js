const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require('../util/config');

router.get('/', function(req, res) {
    fs.readFile(config.getLogsPath(), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Unable to read log file', logs: []});
        }
        const logLines = data.split('\n');
        return res.json({ logs: logLines });
    });
});

module.exports = router;
