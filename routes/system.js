const express = require('express');
const { execSync } = require('child_process');
const si = require('systeminformation');
const router = express.Router();
const system = require('../util/system');
const storage = require('../util/storage');

router.get('/', function (req, res) {
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
    const networkInterfaces = await si.networkInterfaces()
    const networkStats = await si.networkStats();
    const temp = await si.cpuTemperature();
    const time = si.time();
    const os = await si.osInfo();

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

    let mainNetworkStats = networkStats.find(network => network.rx_sec > 0 || network.tx_sec > 0);
    if (!mainNetworkStats) {
      if (networkStats.length > 0) {
        mainNetworkStats = networkStats[0];
      } else {
        mainNetworkStats = {
          rx_sec: 0,
          tx_sec: 0,
        }
      }
    }

    let defaultNetworkInterface = networkInterfaces.find(network => network.default);
    if (!defaultNetworkInterface) {
      if (networkInterfaces.length > 0) {
        defaultNetworkInterface = networkInterfaces[0];
      } else {
        defaultNetworkInterface = {
          ip4: "127.0.0.1"
        }
      }
    }

    // Try to get resolution using fbset -s
    let mainDisplay = {
      currentResX: 0,
      currentResY: 0,
    };

    try {
      const fbsetOutput = execSync('fbset -s', { encoding: 'utf8' });
      const match = fbsetOutput.match(/geometry\s+(\d+)\s+(\d+)/);
      if (match) {
        mainDisplay.currentResX = parseInt(match[1], 10);
        mainDisplay.currentResY = parseInt(match[2], 10);
      }
    } catch (e) {
      // fallback to systeminformation graphics
      const graphics = await si.graphics();
      const displays = graphics.displays;
      let siDisplay = displays.find(display => display.main);
      if (!siDisplay) {
      if (displays.length > 0) {
        siDisplay = displays[0];
      } else {
        siDisplay = {
          currentResX: 0,
          currentResY: 0,
        }
      }
      }
      mainDisplay = siDisplay;
    }

    const kbFactor = 1024 ** 1;
    const gbFactor = 1024 ** 3;

    res.json({
      cpu: {
        load: cpu.currentLoad.toFixed(2),
      },
      memory: {
        total: (mem.total / gbFactor).toFixed(2),
        used: ((mem.total - mem.available) / gbFactor).toFixed(2),
      },
      disk: {
        total: Math.round(rootFs.size / gbFactor), // in GB
        used: Math.round(rootFs.used / gbFactor),
      },
      network: {
        download: (mainNetworkStats.rx_sec / kbFactor).toFixed(2),
        upload: (mainNetworkStats.tx_sec / kbFactor).toFixed(2),
        addr: defaultNetworkInterface.ip4,
      },
      temperature: temp.main ? temp.main.toFixed(2) : 'N/A',
      uptime: (time.uptime / 3600).toFixed(2), // in hours
      display: {
        width: mainDisplay.currentResX,
        height: mainDisplay.currentResY,
      },
      os: {
        name: os.distro,
        architecture: os.arch,
        hostname: os.hostname,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

router.post('/clear-tmp-dir', function (req, res) {
  storage.clearTmpDir();

  res.redirect('/system');
});

module.exports = router;