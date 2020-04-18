export function last(items) {
  return items[items.length - 1];
}

export function sum(numbers) {
  return numbers.reduce((acc, number) => acc + number, 0);
}

export function removeAt(items, i) {
  return items.filter((_, j) => j !== i);
}

export function repeatedly(func, ms) {
  func();
  return setInterval(func, ms);
}
