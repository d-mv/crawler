import fetch from 'node-fetch';
import cheerio from 'cheerio';

import { makeStringFromTemplate } from './string';
import { ERRORS } from '@data/index';

// abstraction on fetch and cheerio methods
async function getPage(url: string): Promise<cheerio.Root> {
  try {
    const page = await fetch(url);

    const pageText = await page.text();

    return cheerio.load(pageText);
  } catch (err) {
    throw Error(makeStringFromTemplate(ERRORS.funcError, ['getPage', err.message]));
  }
}

const getTitle = (body: cheerio.Root): string => body('title').text() || 'untitled';

export { getPage, getTitle };
