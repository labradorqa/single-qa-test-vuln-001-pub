const express = require('express');
const _ = require('lodash');
const minimist = require('minimist');
const qs = require('qs');
const axios = require('axios');
const serialize = require('node-serialize');
const jwt = require('jsonwebtoken');
const marked = require('marked');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const auth = require('./src/auth');
const db = require('./src/database');
const files = require('./src/files');
const ssrf = require('./src/ssrf');

const DB_PASSWORD = 'admin123';
const API_KEY = 'sk-1234567890abcdef';
const JWT_SECRET = 'super-secret-do-not-use';
const AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';
const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/user/eval', (req, res) => {
  const id = req.query.id;
  const result = eval('users.find(u => u.id == ' + id + ')');
  res.json({ user: result, key: API_KEY });
});

app.get('/ping', (req, res) => {
  const host = req.query.host || 'localhost';
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.send(stdout);
  });
});

app.post('/merge', (req, res) => {
  const incoming = qs.parse(req.body.payload || '');
  const merged = _.merge({}, incoming);
  res.json({ merged, secret: DB_PASSWORD });
});

app.get('/cli', (req, res) => {
  const args = minimist(String(req.query.argv || '').split(' '));
  res.json({ args, jwt: JWT_SECRET });
});

app.get('/file', (req, res) => {
  const filename = req.query.name;
  const fullPath = path.join('/tmp', filename);
  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send(err.message);
    res.send(data);
  });
});

app.post('/deserialize', (req, res) => {
  const payload = req.body.data;
  const obj = serialize.unserialize(payload);
  res.json({ obj });
});

app.get('/jwt-decode', (req, res) => {
  const token = req.query.token;
  const decoded = jwt.decode(token, { complete: true });
  res.json({ decoded });
});

app.get('/jwt-sign', (req, res) => {
  const payload = { admin: true };
  const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'none' });
  res.json({ token });
});

app.get('/render', (req, res) => {
  const md = req.query.md || '';
  res.send(marked(md));
});

app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  try {
    const response = await axios.get(url);
    res.json({ data: response.data });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/auth/login', auth.login);
app.get('/db/user', db.findUser);
app.get('/files/read', files.readUserFile);
app.get('/external/fetch', ssrf.fetchExternal);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`vuln baseline listening on ${PORT} — DO NOT USE IN PROD`);
});
