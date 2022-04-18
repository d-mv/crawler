import socket, { Socket } from 'socket.io';
import http from 'http';

import { log } from '@tools/index';
import { queryController } from '@controllers/index';
import { QueryClass } from '@classes/index';
import { logObject } from '@tools/index';
import { Results } from '@models/index';

// hold class instance
let instance: SocketConnection | undefined;

class SocketConnection {
  static httpServer: http.Server;

  // setup (if needed) and return singleton, so we could access WS connection from anywhere
  // in the app
  public static instance(httpServer?: http.Server, asNew?: boolean): SocketConnection {
    // if server is not assigned -> assign  to be used in constructor
    if (!SocketConnection.httpServer && httpServer) SocketConnection.httpServer = httpServer;

    // if new instance requested -> clear and re-assign variable with newly created instance
    if (asNew) instance = undefined;

    // check is required for 1st ever request
    if (!instance) instance = new SocketConnection();

    // return new or existing instance
    return instance;
  }

  #server: socket.Server;

  #socket: Socket | undefined;

  constructor() {
    // setup socket server
    this.#server = socket(SocketConnection.httpServer as http.Server, {
      perMessageDeflate: {
        threshold: 32768,
      },
    });

    // on successful connection -> assign to instance variable for later use, subscribe to events
    this.#server.on('connection', socket => {
      // logging, custom encryption, session storing, assigning additional WS connections
      // to tunnel requests with/without modification
      log('Incoming connection', socket.handshake.address);

      // we'll need to get access to instance; assign here, because we are sure now, that
      // connection is up and available (especially important in case custom encryption
      // implementation)
      this.#socket = socket;

      // to simplify/shorten the code, below can be reduced to:
      //
      // const processQueryRequest = ()=>{}
      // this.#socket.on('query',processQueryRequest)
      //
      this.#socket.on('query', async (req: QueryClass) => {
        logObject(req, 'Incoming query');

        // convert the request to class for verification and quick access to elements of the query
        const query = new QueryClass(req);

        if (query.isOK) {
          // forward request to query controllers
          queryController[query.domain](query);
        } else {
          // here we can send back immediate result of query validation - query.errors
        }
      });
    });
  }

  // send result of crawling
  public sendResult(data: Results) {
    this.#socket?.emit('results', data);
  }

  // send updates on the process
  public sendUpdate(data: string) {
    this.#socket?.emit('updates', data);
  }
}

export { SocketConnection };
