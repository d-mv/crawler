import { map } from 'ramda';

import { PageInfo, QueryObject, Results } from '@models/index';
import { elapsedTimeInSeconds, logError } from '@tools/index';
import { PageClass } from '../classes/page.class';

interface Props {
  pages: Set<PageClass>;
  id: string;
  start: number;
}

async function save(pages: PageClass[], index: number) {
  try {
    await pages[index].object.save();

    if (index !== pages.length - 1) save(pages, index + 1);
  } catch (err) {
    logError('ResultsClass._save caught error:', err.message);
  }
}

function mapInfoFromClass(page: PageClass): PageInfo {
  return page.info;
}

// function to add extra date to final results object, save each page into DB
// can be added update of
async function makeResults(props: Props, id: string): Promise<Results> {
  const end = new Date().valueOf();

  const elapsedTime = elapsedTimeInSeconds(props.start, end);

  const arrayOfPages = Array.from(props.pages);

  // save each page in the DB; we can implement additional check and update pages, not saving
  // duplicates
  await save(arrayOfPages, 0);

  // update query in the DB with elapsed time and qty of results
  await QueryObject.updateOne({ id }, { elapsedTime, qtyOfPages: props.pages.size });

  // return object of data to send to the user
  return {
    id: props.id,
    data: map(mapInfoFromClass, arrayOfPages),
    qty: props.pages.size,
    start: props.start,
    end,
    elapsedTime,
  };
}

export { makeResults };
