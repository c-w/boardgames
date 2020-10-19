import { scoreCard } from './sgp';

describe('Score Nigiri', () => {
  test.each([
    ['Egg', 1],
    ['Salmon', 2],
    ['Squid', 3],
  ])('%s', (name, expected) => {
    const hand = [{ name, category: 'Nigiri'}];
    const otherHands = [];
    const round = 1;
    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(expected);
  });
});
