import { QueryClass } from '@classes/index';
import { Domain } from '@models/index';

import { makeRoutes } from '@tools/index';
import { crawlController } from './crawl.controller';

// main controller = object with default return, in case the query domain is not found;
// allows quick routing to target domain controller(which is the similarly structured)
// and call for action; current setup allows multi-domain configuration multi-actions,
// avoidance of large 'switch' / 'if' setups, quick processing time, ease of scaling of
// the application - both back - end and front - end wise, fully abstracted from the method
// of connection - REST / WS; { queryController: true }, is required for 'makeRoutes'
// function to differ between queryController and domainController.
const queryController = makeRoutes(
  { [Domain.CRAWL]: (query: QueryClass) => crawlController[query.action](query) },
  { queryController: true },
);

export { queryController };
