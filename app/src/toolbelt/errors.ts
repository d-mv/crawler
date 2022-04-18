import { compose, keys, reduce } from 'ramda';

import { FormErrors } from 'src/models';
import { joinStrings } from '.';

const makeErrorsString = (errors: Partial<FormErrors>) => {
  const reducerFn = (acc: string, key: string) => (errors[key] ? joinStrings(acc, errors[key]) : acc);

  return compose(reduce(reducerFn, ''), keys)(errors);
};

const thereAreErrors = (errors: Partial<FormErrors>) =>
  errors.ignoreSelf || errors.maxDepth || errors.maxTotalPages || errors.startUrl;

export { makeErrorsString, thereAreErrors };
