import { findLongestWord, sortNumbersAscending } from './task3';

describe('sortNumbersAscending', () => {
  it('sorts a copy of the numbers in ascending order without mutating the input', () => {
    const numbers = [12, -4, 7, 7, 2];

    expect(sortNumbersAscending(numbers)).toEqual([-4, 2, 7, 7, 12]);
    expect(numbers).toEqual([12, -4, 7, 7, 2]);
  });
});

describe('findLongestWord', () => {
  it('returns the longest word in the sentence and ignores punctuation', () => {
    expect(findLongestWord('Rick, Morty, and Summer explore dimensions.')).toBe(
      'dimensions'
    );
  });

  it('returns an empty string for a blank sentence', () => {
    expect(findLongestWord('   ')).toBe('');
  });
});
