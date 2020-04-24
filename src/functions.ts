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
 * Lower the first char of a string
 *
 * @param string string
 */
export function lowerFirstChar(string: string): string {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
