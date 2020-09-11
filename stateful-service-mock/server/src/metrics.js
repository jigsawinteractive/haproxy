const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const activeConnections = new client.Gauge({
    name: 'mock_server_active_connections',
    help: 'Test metric for mock server active connections',
    labelNames: ['server_id', 'run_id']
})

module.exports = {activeConnections};