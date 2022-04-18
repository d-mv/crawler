import { QueryClass } from '@classes/index';
import { PageInfo } from './page.model';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyValue = any;
type Result<T> = { isOK: boolean; message?: string; status?: number; payload?: T };
type Either<T, K> = T | K;
type Maybe<T> = T | undefined | null;
type RoutesObject<T> = Record<string, (query: QueryClass) => T>;

interface Results {
  id: string;
  data: PageInfo[];
  qty: number;
  start: number;
  end: number;
  elapsedTime: number;
}

export { AnyValue, Result, Either, Maybe, RoutesObject, Results };
