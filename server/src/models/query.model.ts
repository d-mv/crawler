import { model, Schema } from 'mongoose';
import { Maybe } from './general.model';

interface CrawlOptions {
  maxDepth: number;
  maxTotalPages: number;
  ignoreSelf: boolean;
}

enum Domain {
  CRAWL = 'crawl',
}

enum Actions {
  START = 'start',
  CANCEL = 'cancel',
}
interface Query {
  id: string;
  domain: Domain;
  action: Actions;
  startUrl: string;
  options: Maybe<Partial<CrawlOptions>>;
}

const querySchema = new Schema({
  id: { type: String, required: true, index: true, unique: true },
  domain: { type: String, required: true },
  action: { type: String, required: true },
  startUrl: { type: String, required: true },
  options: {
    maxDepth: { type: Number },
    maxTotalPages: { type: Number },
    ignoreSelf: { type: Boolean },
  },
  elapsedTime: { type: Number },
  qtyOfPages: { type: Number },
});

const QueryObject = model('Query', querySchema);

export { Domain, Actions, QueryObject };

export type { Query, CrawlOptions };
