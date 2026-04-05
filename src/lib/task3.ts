export const sortNumbersAscending = (numbers: number[]): number[] => {
  const sortedNumbers = [...numbers];

  for (let index = 1; index < sortedNumbers.length; index += 1) {
    const valueToInsert = sortedNumbers[index];
    let cursor = index - 1;

    while (cursor >= 0 && sortedNumbers[cursor] > valueToInsert) {
      sortedNumbers[cursor + 1] = sortedNumbers[cursor];
      cursor -= 1;
    }

    sortedNumbers[cursor + 1] = valueToInsert;
  }

  return sortedNumbers;
};

export const findLongestWord = (sentence: string): string => {
  const words = sentence.match(/[A-Za-z0-9']+/g) ?? [];

  if (words.length === 0) {
    return '';
  }

  return words.reduce((longestWord, currentWord) =>
    currentWord.length > longestWord.length ? currentWord : longestWord
  );
};
