import io from 'socket.io-client';
import { v4 as generateId } from 'uuid';
import { assoc } from 'ramda';

import { AnyAction, Query, Results, StateStore } from 'src/models';
import { RootState } from 'src/store';
import { addMessage, setIsReady, setMessages, setResults } from 'src/store/app/app.reducer';

const { log } = console;

const url = globalThis.location.hostname === 'localhost' ? 'http://localhost:8080/' : globalThis.location.origin + '/';

class SocketService {
  #dispatch: (arg0: AnyAction) => void;

  #getState: () => RootState;

  #service: SocketIOClient.Socket | undefined;

  constructor(store: StateStore) {
    this.#dispatch = store.dispatch;
    this.#getState = store.getState;
    this.#service = this._connect();

    if (this.#service) {
      this.#service.on('connect', () => this.#dispatch(setIsReady(true)));
      this.#service.on('disconnect', () => log('disconnected'));
      this.#service.on('results', (data: Results) => {
        this.#dispatch(setResults(data));
      });
      this.#service.on('updates', (message: string) => {
        this.#dispatch(addMessage(message));
      });
    }
  }

  private _connect() {
    return io(url, {
      transports: ['websocket'],
    });
  }

  public sendRequest(query: Query) {
    this.#dispatch(setMessages([]));
    this.#dispatch(setResults(undefined));
    this.#service?.emit('query', assoc('id', generateId(), query), (...props: unknown[]) => log('confirmed?', props));
  }
}

export { SocketService };
