import { applyMiddleware, createStore, StoreEnhancer } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { combineReducers } from 'redux';

import AppReducer from './app/app.reducer';
import { appMiddleware } from './middleware';

const isDev = (): boolean => process.env.NODE_ENV === 'development';

const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
});

const middleware: StoreEnhancer = isDev()
  ? composeWithDevTools(applyMiddleware(logger, appMiddleware))
  : applyMiddleware(appMiddleware);

const reducers = combineReducers({
  app: AppReducer,
});

const store = createStore(reducers, {}, middleware);

type RootState = ReturnType<typeof store.getState>;

export { store };

export type { RootState };
