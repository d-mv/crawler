import express from 'express';

import { QueryClass } from '@classes/index';
import { queryController } from '@controllers/index';
import { ERRORS } from '@data/index';
import { logError, makeStringFromTemplate } from '@tools/index';

const router = express.Router();

// POST route; can be disabled or used for testing purposes during development
router.post('/', async function (req, res, _next) {
  try {
    const query = new QueryClass(req.body);

    if (query.isOK) {
      await query.object.save();

      queryController[query.domain](query);

      res.send();
    } else {
      logError(makeStringFromTemplate(ERRORS.queryError, [query.errors]));
      res.statusMessage = 'Query error';
      res.status(400).end();
    }
  } catch (err) {
    logError(makeStringFromTemplate(ERRORS.route, ['POST /', err.message]));
    res.statusMessage =
      makeStringFromTemplate(ERRORS.route, ['POST /', err.message]) || 'Unknown error';
    3;
    res.status(err.code < 600 ? err.code : 500).send();
  }
});

export { router };
