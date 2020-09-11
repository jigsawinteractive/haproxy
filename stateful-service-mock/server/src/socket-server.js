const ws = require('ws');
const url = require('url');

const { log } = require('./log');
const { activeConnections } = require('./metrics');
const { server, INSTANCE_ID } = require('./server');

const CLIENT_PING_INTERVAL = 10 * 1000;

const CLIENT_PING_TIMERS = new Map();
const CLIENTS_PER_RUN = new Map();


const socketServer = new ws.Server({ server });

socketServer.on('connection', (client, request) => {
    const query = url.parse(request.url, true).query;

    const id = query.id;
    if (!id) {
        log(`Rejecting client connection, because of invalid id: ${id}`, 'error');
        client.close();
        return;
    }

    if (!CLIENTS_PER_RUN.has(id)) {
        CLIENTS_PER_RUN.set(id, new Set());
    }

    const clientSet = CLIENTS_PER_RUN.get(id);
    clientSet.add(client);

    activeConnections.set({ server_id: INSTANCE_ID, run_id: id}, clientSet.size);

    log(`Client connection accepted for ${id}`);

    client.on('close', () => {
        log(`Client connection closed for ${id}`);
        clientSet.delete(client);

        activeConnections.set({ server_id: INSTANCE_ID, run_id: id}, clientSet.size);

        if (CLIENT_PING_TIMERS.has(client)) {
            clearInterval(CLIENT_PING_TIMERS.get(client));
            CLIENT_PING_TIMERS.delete(client);
        }
    });

    client.on('message', (data) => {
        log(`Client sent message: ${JSON.stringify(data)}`, 'debug');
    })

    setInterval(() => {
        client.send(JSON.stringify({message: 'ka', timestamp: Date.now()}));
    }, CLIENT_PING_INTERVAL);
});
