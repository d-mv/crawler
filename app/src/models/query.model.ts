import { Maybe } from '.';

interface CrawlOptions {
  maxDepth: number;
  maxTotalPages: number;
  ignoreSelf: boolean;
}

enum QueryDomain {
  CRAWL = 'crawl',
}

enum QueryActions {
  START = 'start',
  CANCEL = 'cancel',
}

interface Query {
  id: string;
  domain: QueryDomain;
  action: QueryActions;
  startUrl: string;
  options: Maybe<Partial<CrawlOptions>>;
}

export { QueryDomain, QueryActions };

export type { Query, CrawlOptions };
