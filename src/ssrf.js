const axios = require('axios');
const request = require('request');

async function fetchExternal(req, res) {
  const url = req.query.url;
  try {
    const response = await axios.get(url);
    res.json({ status: response.status, data: response.data });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

function proxyRequest(req, res) {
  const target = req.query.target;
  request(target).pipe(res);
}

module.exports = { fetchExternal, proxyRequest };
