import { isWebUri } from 'valid-url';

import { Maybe } from 'src/models';

const joinStrings = (string1: string, string2: string | undefined): string => {
  if (!string1) return string2 || '';

  return string1 + '. ' + string2 || '';
};

const isValidUrl = (value: Maybe<string>) => value && isWebUri(value);

export { joinStrings, isValidUrl };
