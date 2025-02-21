const express = require('express');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');
const si = require('systeminformation');

router.get('/', function(req, res) {
    res.locals = {
        currVersion: system.getInstalledVersion().trim(),
        newestVersion: system.getLatestVersion().trim(),
        tmpFiles: storage.countFilesInTmpDir(),
    };

    res.render('system', { title: res.__('System') });
});

router.get('/metrics', async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const disks = await si.fsSize();
    const networks = await si.networkStats();
    const temp = await si.cpuTemperature();
    const time = si.time();

    let rootFs = disks.find(disk => disk.mount === '/' || disk.mount === 'C:\\');
    if (!rootFs) {
        if (disks.length > 0) {
            rootFs = disks[0];
        } else {
            rootFs = {
                size: 0,
                used: 0,
            }
        }
    }

    let mainNetwork = networks.find(network => network.rx_sec > 0 || network.tx_sec > 0);
    if (!mainNetwork) {
        if (networks.length > 0) {
            mainNetwork = networks[0];
        } else {
            mainNetwork = {
                rx_sec: 0,
                tx_sec: 0,
            }
        }
    }

    const kbFactor = 1024 ** 1;
    const gbFactor = 1024 ** 3;

    res.json({
      cpu: {
        load: cpu.currentLoad.toFixed(2),
      },
      memory: {
        total: Math.round(mem.total / gbFactor),
        used: Math.round((mem.total - mem.available) / gbFactor)
      },
      disk: {
        total: Math.round(rootFs.size / gbFactor), // in GB
        used: Math.round(rootFs.used / gbFactor),
      },
      network: {
        download: (mainNetwork.rx_sec / kbFactor).toFixed(2),
        upload: (mainNetwork.tx_sec / kbFactor).toFixed(2)
      },
      temperature: temp.main || 'N/A',
      uptime: (time.uptime / 3600).toFixed(2), // in hours
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system metrics' + err });
  }
});

router.post('/clear-tmp-dir', function(req, res) {
    storage.clearTmpDir();

    res.redirect('/system');
});

module.exports = router;