import 'module-alias/register';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import http from 'http';
import { connect } from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import path from 'path';

import { log, logError, logger } from '@tools/index';
import { SocketConnection } from '@services/socket.service';

import { router } from '@app/routes';
import { AnyValue } from './models';

dotenv.config();

const app = express();

let httpServer: http.Server | undefined;

function setupServer(port: string) {
  try {
    // middleware
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(logger);

    // routes
    app.use('/api/query', router);
    app.use(express.static(path.join(__dirname, '/../../build')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname + '/../../build/index.html'));
    });

    // error handling
    app.use(methodOverride());
    app.use((err: AnyValue, _req: express.Request, res: express.Response) => {
      console.error('err >>>', err);
      res.status(500).send('Something broke!');
    });

    start(port);
  } catch (err) {
    logError('Error in server function', err);
  }
}

let socket: SocketConnection | undefined;

async function start(port: string) {
  try {
    // create server, launch ws connectivity, connect to db
    httpServer = http.createServer(app);
    httpServer.listen(port, async () => {
      socket = SocketConnection.instance(httpServer as http.Server);

      if (process.env.NODE_MODE !== 'test') {
        log(`Server is up and listening on port:`, port);
      }

      if (process.env.DB_URL)
        connect(
          process.env.DB_URL,
          { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
          () => {
            if (process.env.NODE_MODE !== 'test') {
              log('Database is connected');
            }
          },
        );
    });
  } catch (err) {
    logError('Error in starting', err);
  }
}

// launch the sequence
setupServer(process.env.PORT || '8080');

export { httpServer, socket };

export default setupServer;
