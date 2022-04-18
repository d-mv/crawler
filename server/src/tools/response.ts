import { ERRORS } from '@data/index';
import { Result } from '@models/index';
import { makeStringFromTemplate } from './string';

function fail(message: string, status?: number): Result<never> {
  return { isOK: false, message: message ?? 'Unknown server error.', status: status ?? 500 };
}

function success<T>(payload?: T): Result<T> {
  return { isOK: true, payload };
}

function noAction(action: string, domain: string): Result<never> {
  return fail(makeStringFromTemplate(ERRORS.actionNotFound, [action, domain]));
}

function noDomain(domain: string): Result<never> {
  return fail(makeStringFromTemplate(ERRORS.domainNotFound, [domain]));
}

export { fail, success, noAction, noDomain };
