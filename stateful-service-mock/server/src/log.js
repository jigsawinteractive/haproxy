const { INSTANCE_ID } = require('./server');

const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

const log = (message, level = 'info') => {
    if (level === 'debug' && LOG_LEVEL === 'debug') {
        console[level](`Instance ${INSTANCE_ID}: ${message}`);
        return;
    }

    console[level](`Instance ${INSTANCE_ID}: ${message}`)
}

module.exports = {log};