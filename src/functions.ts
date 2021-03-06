/**
 * Capitalize the first letter of the string
 *
 * @param word
 */
export function capitalize(word: string): string {
  if (!word) {
    return word;
  }

  return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

/**
 * Transform to a positive number, if not transformable, use 1.
 *
 * @param numString
 */
export function transformToNum(numString: string): number {
  let num: number = +numString.trim();
  if (!num || num <= 0) {
    num = 1;
  }

  return num;
}

/**
 * Return a random of an array
 *
 * @param array: array
 *
 * @return any
 */
export function randomFromArray(array: any[]): any {
  const randomNum: number = Math.round((array.length - 1) * Math.random());

  return array[randomNum];
}
