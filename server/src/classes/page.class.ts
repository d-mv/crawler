import { ParsedData, Links, PageInfo, PageObject } from '@models/index';
// PageClass data class validates data, stores, enrich with additional information
class PageClass {
  #title: string;

  #depth: number | undefined;

  #url: string;

  #links: Links;

  #qtyOfLinks: number;

  constructor(props: ParsedData) {
    this.#title = props.title;
    this.#url = props.url;
    this.#links = props.links;
    // example of data enrichment
    this.#qtyOfLinks = props.links.length;
  }

  get links(): Links {
    return this.#links;
  }

  set depth(value: number) {
    this.#depth = value;
  }

  get info(): PageInfo {
    return {
      title: this.#title,
      depth: this.#depth || 0,
      url: this.#url,
      links: this.#links,
      qtyOfLinks: this.#qtyOfLinks,
    };
  }

  // create DB object to be saved
  // TODO: merge functionality and TypeScript types
  get object() {
    return new PageObject(this.info);
  }
}

export { PageClass };
