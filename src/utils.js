export function last(items) {
  return items[items.length - 1];
}

export function sum(numbers) {
  return numbers.reduce((acc, number) => acc + number, 0);
}
