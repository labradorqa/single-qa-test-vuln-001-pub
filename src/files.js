const fs = require('fs');
const path = require('path');

function readUserFile(req, res) {
  const userPath = req.query.path;
  const target = path.join('/var/data', userPath);
  fs.readFile(target, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err.message);
    res.send(data);
  });
}

function listDir(req, res) {
  const dir = req.query.dir;
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).send(err.message);
    res.json(files);
  });
}

function deleteFile(req, res) {
  const filename = req.query.f;
  fs.unlink(filename, () => res.send('ok'));
}

module.exports = { readUserFile, listDir, deleteFile };
