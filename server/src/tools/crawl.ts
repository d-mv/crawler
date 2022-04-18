import { FetchError } from 'node-fetch';
import { isNil, slice, append } from 'ramda';

import { PageClass, QueryClass } from '@classes/index';
import { ERRORS } from '@data/index';
import { Link, CrawlOptions } from '@models/index';
import {
  mergeArrayToSet,
  logInfo,
  makeStringFromTemplate,
  getPage,
  getTitle,
  linksFromResult,
  verifyLink,
} from '.';
import { makeResults } from './make_results';
import { SocketConnection } from '@services/socket.service';
import { multiples } from './string';

// abstraction to do two things -> update user on the front and help developer understand
// what is happening; can be used for integration tests;
const sendUpdate = (message: string) => {
  SocketConnection.instance().sendUpdate(message);
  logInfo(message);
};

// Crawl logic class is processing logic, collected inside the class to share common instance
// variables to avoid extensive arguments pool (props drilling)
class CrawlForLinks {
  #query: QueryClass;

  // using Set will allows us to quickly get only unique results; this, of course, can
  // be made optional
  #result = new Set<PageClass>();

  #currentDepth = 0;

  #currentLinks: Link[] = [];

  #currentRootLink: Link;

  #currentResults: PageClass[] = [];

  #options: CrawlOptions;

  #timeStarted = 0;

  constructor(query: QueryClass) {
    // we split query to give us quick and shorter access to it's elements
    this.#query = query;
    this.#options = query.options;
    this.#currentLinks = [query.startUrl];
    this.#currentRootLink = query.startUrl;
  }

  // merge newer results with existing ones
  private _mergeResults(results: PageClass[]) {
    this.#result = mergeArrayToSet(this.#result, results);
  }

  // are we deep enough or should continue
  private _isDeepEnough = () => {
    if (this.#currentDepth <= this.#options.maxDepth) return false;

    logInfo(`it's deep enough!`);
    return true;
  };

  // is this link is the same as the link of the current page we are scanning, then we don't need it
  private _isCurrentRoot = (link: string): boolean =>
    link === this.#currentRootLink || link === this.#currentRootLink + '/';

  // who am I? I am myself, maybe
  private _isSelf = (link: string) => link === '/' || this._isCurrentRoot(link);

  // we don't need litter in the results, so we can implement as many checks; moreover,
  // we can extract this logic and make interchangeable, base on the query options
  private _checkLink = (link: string | undefined) => {
    // return undefined if is not a link
    if (!verifyLink(link)) return undefined;

    // return undefined if self should be ignored
    if (this.#options.ignoreSelf && this._isSelf(link || '')) return undefined;

    // if self -> replace with current root
    if (link === '/') return this.#currentRootLink;

    // if doesn't start with 'http' -> add current root
    if (slice(0, 4, link as string) !== 'http') return this.#currentRootLink + link;

    return link;
  };

  // collect all the links from the 'body' of the page provided
  private _collectLinks(body: cheerio.Root): string[] {
    const links = Array.from(body('a'));

    // the less we do the better; it's called  - optimization;
    if (links.length) {
      let currentLinks: string[] = [];
      // updating the user with progress
      sendUpdate(
        `processing ${links.length} ${multiples('link', links.length)} for root ${
          this.#currentRootLink
        }`,
      );

      // can be converted into recursion
      for (const link of links) {
        const checkedLink = this._checkLink(link.attribs.href);

        // add only if 'checkedLink' is available
        if (!!checkedLink) currentLinks = append(checkedLink, currentLinks);
      }

      // reduce to unique values
      return Array.from(new Set(currentLinks));
    }

    return [];
  }

  // parsing page for a provided link
  private async _parsePage(url: Link): Promise<PageClass> {
    this.#currentRootLink = url;
    // updating the user with progress
    sendUpdate(`parsing page ${this.#currentRootLink}`);

    try {
      // fetch the page
      const page = await getPage(this.#currentRootLink);

      // get it's title
      const title = getTitle(page);

      // find and process links
      const links = this._collectLinks(page);

      // updating the user with progress
      sendUpdate(`got ${links.length} unique ${multiples('link', links.length)}`);
      // return class object, which will clean, update and/or enrich out data with additional
      // bits and pieces
      return new PageClass({ title, url, links });
    } catch (err) {
      // if problem with fetching -> informing calling party
      if (err instanceof FetchError) {
        throw Error(makeStringFromTemplate(ERRORS.notFound, [url]));
      }

      // if not, still something might happen, we need to control, not to waiting for
      // bubbling
      throw Error(err.message);
    }
  }

  // compare results vs maxTotalPages; can be used without argument -> will use class instance
  // storage of results; this is needed to be able to check if we should stop in the process of
  // scanning each page and at the root of each level of depth to avoid extra work (optimization!)
  private _compareResults = (resultsQty?: number) => {
    if (isNil(resultsQty)) return this.#result.size < this.#options.maxTotalPages;

    // overall collected results + results currently collected by the method vs maxTotalPages
    return this.#result.size + resultsQty < this.#options.maxTotalPages;
  };

  // main function to check if we have collected enough pages
  private _isEnoughPages = (resultsQty?: number) => {
    // if no limitation or we haven't reached them
    if (this.#options.maxTotalPages === -1 || this._compareResults(resultsQty)) return false;

    logInfo('enough pages crawled!');

    return true;
  };

  // main parser function, which recursively process current links array
  private async _parser(index = 0): Promise<PageClass[]> {
    try {
      // cleanup results, if needed
      if (!index && this.#currentResults.length) this.#currentResults = [];

      // parsing page
      const page = await this._parsePage(this.#currentLinks[index]);

      // update instance of PageClass with currentDepth
      page.depth = this.#currentDepth;

      // update global results
      this.#currentResults = append(page, this.#currentResults);

      // we can continue if not enough pages and we haven't finished the links
      if (
        !this._isEnoughPages(this.#currentResults.length) &&
        index < this.#currentLinks.length - 1
      )
        // call myself for next links
        await this._parser(index + 1);

      // there is not specific need to return this;
      return this.#currentResults;
    } catch (err) {
      throw Error(`(parser): ${err.message}`);
    }
  }

  // start recursively scanning through levels (depths)
  private async _process() {
    sendUpdate(
      `level ${this.#currentDepth} of ${this.#options.maxDepth} ${multiples(
        'level',
        this.#options.maxDepth,
      )}...`,
    );

    // parse links for current one
    const results = await this._parser();

    // add new results
    this._mergeResults(results);

    // if we reached the limit, quit
    if (this._isEnoughPages()) return true;

    // update depth and links for next turn
    this.#currentDepth = this.#currentDepth + 1;
    this.#currentLinks = linksFromResult(results);

    // if there are still links and we haven't reached the required depth,
    // dive in for more
    if (this.#currentLinks.length && !this._isDeepEnough()) {
      await this._process();
    }

    return true;
  }

  // only exposed method
  public async getResults() {
    // start timer
    this.#timeStarted = new Date().valueOf();
    // update user
    sendUpdate('starting...');

    // wait for process to finish
    await this._process();
    // update user again
    sendUpdate(`done: ${this.#result.size} ${multiples('page', this.#result.size)}`);

    // make, save to DB and return results
    const results = await makeResults(
      {
        id: this.#query.id,
        start: this.#timeStarted,
        pages: this.#result,
      },
      this.#query.id,
    );

    return results;
  }
}

export { CrawlForLinks };
