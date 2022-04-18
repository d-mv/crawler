import { RootState } from 'src/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValue = any;

type Either<T, K> = T | K;

type Maybe<T> = T | undefined | null;

interface AnyAction<T = AnyValue> {
  type: string;
  payload?: T;
}

type StateStore = { dispatch: (arg0: AnyAction) => void; getState: () => RootState };

interface FormErrors extends Record<string, string> {
  startUrl: string;
  maxDepth: string;
  maxTotalPages: string;
  ignoreSelf: string;
}

export type { AnyAction, AnyValue, Either, Maybe, StateStore, FormErrors };
