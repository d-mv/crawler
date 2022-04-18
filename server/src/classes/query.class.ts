import { join, mergeRight } from 'ramda';

import { Actions, CrawlOptions, Domain, Link, Query, QueryObject } from '@models/index';
import { cleanUpLink } from '@tools/index';

// QueryClass data class validates query, holds it's elements and give quick access to it's elements; can be split to allow partial re-used for different types of queries
class QueryClass {
  #id: string | undefined;

  #domain: Domain | undefined;

  #action: Actions | undefined;

  /**
   * maxDepth === 0 -> get only set of links for startUrl;
   * maxTotalPages === -1 -> no limit on pages;
   * ignoreSelf === true -> ignore links to itself && startUrl, when collecting links
   **/
  #options: CrawlOptions = { maxDepth: 0, maxTotalPages: -1, ignoreSelf: true };

  #startUrl: Link | undefined;

  #errors: string[] = [];

  constructor(query: Query) {
    // assign data;
    // TODO: implement elements verification
    try {
      this.#id = query.id;
      this.#action = query.action;
      this.#domain = query.domain;
      // remove '/' at the end of the link
      this.#startUrl = cleanUpLink(query.startUrl);

      // if options are provided, merge the options with default ones - this allows to reduce amount of data sent, as default and non-important options won't have to be sent
      if (query.options) this.#options = mergeRight(this.#options, query.options);
    } catch (err) {
      // quick validation on missing elements of malformed request
      this.#errors = [err.message];
    }
  }

  // getters
  get domain() {
    return this.#domain as Domain;
  }

  get action() {
    return this.#action as Actions;
  }

  get options() {
    return this.#options;
  }

  get startUrl() {
    return this.#startUrl as Link;
  }

  get isOK() {
    return this.#errors.length ? false : true;
  }

  get id() {
    return this.#id as string;
  }

  // create DB object to be saved
  // TODO: merge functionality and TypeScript types
  get object() {
    return new QueryObject({
      id: this.#id,
      domain: this.#domain,
      action: this.#action,
      startUrl: this.#startUrl,
      options: this.#options,
    });
  }

  // quick access to validation (or processing) errors
  get errors() {
    return join('. ', this.#errors);
  }
}

export { QueryClass };
