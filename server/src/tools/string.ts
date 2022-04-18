import { is, isNil, not, slice } from 'ramda';

function makeStringFromTemplate(template: string, params: string[]): string {
  let result = template;

  if (params) {
    params.forEach((param, key) => {
      result = result.replace(new RegExp(`%${key + 1}`, 'g'), param);
    });
  }

  return result;
}

const cleanUpLink = (link: string) => {
  if (slice(link.length - 1, 1, link) === '/') {
    return slice(0, link.length - 1, link);
  }

  return link;
};

const verifyLink = (link: unknown): boolean => not(isNil(link)) && is(String, link);

const multiples = (word: string, qty: number) => (qty === 1 ? word : word + 's');

export { makeStringFromTemplate, cleanUpLink, verifyLink, multiples };
