const querystring = require('querystring')
const WebSocket = require('ws');
const net = require('net');
const fs = require('fs');
const { v4 } = require('uuid');

const N_CONNECTIONS = process.env.NCONN || 10;
const SERVER_URL = process.env.SERVER_URL;


const createClientConnection = (url, id) => {
    try {
        const fullUrl = `${url}/?${querystring.stringify({id})}`;
        const client = new WebSocket(fullUrl);
        client.on('error', (error) => {
            console.error(`Client of ${id} got disconnected. ${error.message}, ${error.code}`);
        })

        client.on('open', () => {
            console.debug(`Client connected to ${fullUrl}`);
        })

        client.on('close', (event) => {
            console.error(`Client of ${id} got disconnected.`);
        })

    } catch (e) {
        console.error(`Could not create new client connection to ${fullUrl}. ${e.message}`);
    }
}

const idPrefix = 'mock-session-';

for (let i = 0; i < N_CONNECTIONS; i++) {
    createClientConnection(SERVER_URL, `${idPrefix}${i}`);
}

const startUnixSocketListener = (socketFile) => {
    net.createServer((stream) => {
        stream.on('data', (data) => {
            try {
                const id = data.toString();
                createClientConnection(SERVER_URL, id);
            } catch (e) {
                console.error(`Could not create new client connection to ${SERVER_URL}. ${e.message}`);
            }
        })
    })
        .listen(socketFile);
}

const SOCKETFILE = '/tmp/websocket-bot.sock';

try {
    fs.statSync(SOCKETFILE);
    fs.unlinkSync(SOCKETFILE);
    startUnixSocketListener(SOCKETFILE)
} catch (e) {
    startUnixSocketListener(SOCKETFILE)
}

