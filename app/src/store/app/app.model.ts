import { Results } from 'src/models';

interface AppState {
  isReady: boolean;
  messages: string[];
  results: Results | undefined;
}

const INITIAL_APP_STATE: AppState = {
  isReady: false,
  messages: [],
  results: undefined,
};

export { INITIAL_APP_STATE };

export type { AppState };
