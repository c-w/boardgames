/**
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
export function last(items) {
  return items[items.length - 1];
}

/**
 * @param {number[]} numbers
 * @returns {number}
 */
export function sum(numbers) {
  return numbers.reduce((acc, number) => acc + number, 0);
}

/**
 * @template T
 * @param {T[]} items
 * @param {number} i
 * @returns {T[]}
 */
export function removeAt(items, i) {
  return items.filter((_, j) => j !== i);
}

/**
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
