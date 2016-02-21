import express from 'express';
import stabilityCluster from '../lib';

import cluster from 'cluster';
import os from 'os';
import {processName} from '../lib';

stabilityCluster(({log}) => {
    log(`Reporting for duty.`);

    const app = express();
    app.get('/', (req, res) => res.send(`Hello world. This is worker ${cluster.worker.id}.\n`));

    const port = process.env.PORT || 8000;
    return app.listen(port, () => {
        log(`App ready at http://localhost${port === 80 ? '' : `:${port}`}/`);
    });
}, {
    numberOfWorkers: os.cpus().length,        // this is the default
    handleUncaughtException: true,            // this is the default
    logLevel: 'info',                         // this is the default
    logger: level => (message, ...rest) => {  // this is the default
        if (['fatal', 'error', 'warn'].includes(level.toLowerCase())) {
            console.error(`${processName}: ${level.toUpperCase()}: ${message}`, ...rest);
        } else {
            console.log(`${processName}: ${level.toUpperCase()}: ${message}`, ...rest);
        }
    }
});
