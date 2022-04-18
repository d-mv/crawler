import { model, Schema } from 'mongoose';

type Link = string;

type Links = Link[];

interface PageInfo {
  title: string;
  depth: number;
  url: string;
  links: Links;
  qtyOfLinks: number;
}

type ParsedData = Pick<PageInfo, 'title' | 'url' | 'links'>;

const pageInfoScheme = new Schema({
  title: { type: String, required: true },
  depth: { type: String, required: true },
  url: { type: String, required: true, index: true },
  links: { type: Array, required: true },
  qtyOfLinks: { type: Number, required: true },
});

const PageObject = model('Page', pageInfoScheme);

export { PageObject };

export type { Link, Links, PageInfo, ParsedData };
