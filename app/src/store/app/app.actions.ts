import { Actions, AnyAction, Query } from 'src/models';

const startCrawling = (payload: Query): AnyAction => ({ type: Actions.START_CRAWLING, payload });

export { startCrawling };
