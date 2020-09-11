const { v4 } = require('uuid');
const express = require('express');
const http = require('http');
const client = require('prom-client');

const PORT = process.env.PORT;
const INSTANCE_ID = v4();
const app = express();

app.get('/metrics', (req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
});

const server = http.createServer(app);
server.listen(PORT, () => {});

module.exports = { server, INSTANCE_ID };
