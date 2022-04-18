interface Results {
  id: string;
  data: PageInfo[];
  qty: number;
  start: number;
  end: number;
  elapsedTime: number;
}

type Link = string;

type Links = Link[];

interface PageInfo {
  title: string;
  depth: number;
  url: string;
  links: Links;
  qtyOfLinks: number;
}

export type { Results, PageInfo, Links, Link };
