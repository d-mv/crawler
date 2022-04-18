import { flatten, map, pipe } from 'ramda';
import { noDomain, noAction, fail } from '.';

import { RoutesObject } from '@models/index';
import { PageClass } from '@classes/index';

// simple abstraction on top of JS Proxy functionality, allowing us to hi-jack the requests,
// avoid errors with missing domains/actions, implement default return
function makeRoutes<T>(
  routes: RoutesObject<T>,
  { domain, queryController }: { domain?: string; queryController?: boolean },
) {
  return new Proxy(routes, {
    get(target, prop) {
      // if action/domain is found -> proceed with return function from the object;
      // otherwise -> return function, which once called, will return pre-defined
      // response, base on the second argument, provided to the function
      if (prop in target) return target[prop.toString()];
      else
        return function failed() {
          if (queryController) return noDomain(prop.toString());
          else if (domain) return noAction(prop as string, domain);

          // if nothing is clear, we have another default return
          return fail(`Unknown domain/action - ${prop.toString()}`);
        };
    },
  });
}

const mergeArrayToSet = <T>(dataSet: Set<T>, arr: T[]) => new Set([...Array.from(dataSet), ...arr]);

const returnLinksFromPageClass = (page: PageClass) => page.links;

const linksFromResult = (pages: PageClass[]) => {
  return pipe(map(returnLinksFromPageClass), flatten)(pages);
};

export { makeRoutes, mergeArrayToSet, linksFromResult };
