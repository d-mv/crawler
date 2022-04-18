import { mergeArrayToSet } from '@tools/index';

const mockSet = new Set([0, 1]);

const mockArray = [2, 3];

describe('mergeArrayToSet', () => {
  it('merges objects correctly', () => {
    expect(mergeArrayToSet(mockSet, mockArray)).toEqual(new Set([0, 1, 2, 3]));
  });
  it('merges array to empty set correctly', () => {
    expect(mergeArrayToSet(new Set(), mockArray)).toEqual(new Set([2, 3]));
  });
  it('merges empty array to set correctly', () => {
    expect(mergeArrayToSet(mockSet, [])).toEqual(new Set([0, 1]));
  });
  it('merges empty objects correctly', () => {
    expect(mergeArrayToSet(new Set(), [])).toEqual(new Set());
  });
});
