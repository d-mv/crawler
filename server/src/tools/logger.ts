import chalk from 'chalk';
import express from 'express';
import { is, keys, slice } from 'ramda';
import serialize from 'serialize-javascript';

const { log, dir, group, table, groupEnd } = console;

const isNotTest = process.env.NODE_ENV !== 'test';

function logError(message: string, error?: Error | string) {
  if (isNotTest) {
    log(chalk.redBright(message ? message : 'Express got an error'));

    if (error) logObject(error ?? '');
  }
}

function logInfo(message: string) {
  if (!isNotTest) return;

  return log(chalk.greenBright(message));
}

function logger(req: express.Request, _res: unknown, next: () => void) {
  if (!isNotTest) return;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'noip';

  if (!req.body || !req.body.server) log(chalk.blueBright('[REQ]', ip, req.method, req.path));
  else log(chalk.blueBright('[REQ]', ip, req.method, req.path, '=> check for config'));

  if (keys(req.query).length) {
    group(chalk.yellow('[QUERY]'));

    try {
      if (req.query.query) table(JSON.parse(req.query.query as string));
      else {
        table(req.query);
      }
    } catch (err) {
      log(req.query.query);
    }

    groupEnd();
  }

  if (keys(req.params).length) {
    group(chalk.yellowBright('[PARAMS]'));
    table(req.params);
    groupEnd();
  }

  if (req.body && keys(req.body).length) {
    if (!req.body.server) {
      group(chalk.yellowBright('[BODY]'));
      logObject(req.body);
      groupEnd();
    }
  }

  next();
}

function logObject(obj: unknown, description?: string): void {
  if (!isNotTest) return;

  if (description) log(chalk.blueBright(`[RESPONSE DATA] ${description}`));

  if (is(Array, obj) && (obj as []).length > 3) {
    dir(obj, { depth: 15, colors: true, compact: true });
    log(chalk.bgCyan(`... there are ${(obj as []).length - 3} more items`));
  }

  if (is(String, obj)) log(slice(0, 1000, serialize(obj)) + '...');
  else dir(obj, { depth: 15, colors: true, compact: true });
}

export { log, logError, logInfo, logger, logObject };
