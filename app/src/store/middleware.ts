import { Actions, AnyAction, StateStore } from 'src/models';
import { SocketService } from 'src/services/socket.service';

let service: SocketService;

export const appMiddleware = (store: StateStore) => (next: (arg0: AnyAction) => void) => async (action: AnyAction) => {
  next(action);

  if (!service) service = new SocketService(store);

  switch (action.type) {
    case Actions.START_CRAWLING:
      if (service) service.sendRequest(action.payload);

      break;
  }
};
