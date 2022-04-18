import { makeRoutes, CrawlForLinks } from '@tools/index';

import { QueryClass } from '@classes/index';
import { Actions, QueryObject } from '@models/index';
import { SocketConnection } from '@services/socket.service';

// domain controller, made using makeRoutes with default return in case the
// action is not found; the actions of the domain don't have to be return anything,
// like in case of WS connection, though it's easy to implement returns (with 'success'
// 'fail' methods from tools), required for RESTful operations; mix of both can be easily
// implemented if needed - request for quick operation with result return via REST and
// progress update via WS
const crawlController = makeRoutes(
  {
    // action example - async function capable of making REST calls to other APIs, DB
    //  ideally should not contain too much logic to avoid high complexity of structure
    [Actions.START]: async function (query: QueryClass) {
      // below should not even be checked - there is QueryClass for such cases, to avoid
      // accessing this level of logic, to avoid littering the code with extra checks and
      // to quickly break out of the process
      if (!query.startUrl) throw Error('Missing startUrl.');

      // we are ready to start, let's save query to the DB
      await query.object.save();

      // create instance of crawling mechanism and request results
      const results = await new CrawlForLinks(query).getResults();

      // once available, the results will be sent via socket connection; singleton allows us
      // to get access to service from any method
      SocketConnection.instance().sendResult(results);
    },
  },
  // required for default response;
  { domain: 'crawl' },
);

export { crawlController };
