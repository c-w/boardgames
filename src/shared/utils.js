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

/**
 * @template T
 * @param {...T} items
 * @returns {T[]}
 */
export function distinct(...items) {
  return [...new Set(items)];
}

/**
 * @param {number} length
 * @returns {number[]}
 */
export function range(length) {
  const items = Array(length);

  for (let i = 0; i < length; i++) {
    items[i] = i;
  }

  return items;
}

/**
 * @template T
 * @param {T[]} items
 * @returns {T[][]}
 */
export function pairs(items) {
  const pairs = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }

  return pairs;
}
