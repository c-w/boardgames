import { scoreSuit } from './lc';

describe('Score suit', () => {
  test('positive score', () => {
    const hand = [
      { suit: 'yellow', rank: 5 },
      { suit: 'yellow', rank: 8 },
      { suit: 'yellow', rank: 10 },
    ];

    expect(scoreSuit(hand)).toEqual(3);
  });

  test('nothing played', () => {
    const hand = [];

    expect(scoreSuit(hand)).toEqual(0);
  });

  test('only bet played', () => {
    const hand = [
      { suit: 'white', rank: -1 },
    ];

    expect(scoreSuit(hand)).toEqual(-40);
  });

  test('negative score with bet', () => {
    const hand = [
      { suit: 'green', rank: -1 },
      { suit: 'green', rank: 3 },
      { suit: 'green', rank: 5 },
      { suit: 'green', rank: 7 },
    ];

    expect(scoreSuit(hand)).toEqual(-10);
  });

  test('positive score with bets and bonus', () => {
    const hand = [
      { suit: 'red', rank: -1 },
      { suit: 'red', rank: -3 },
      { suit: 'red', rank: 2 },
      { suit: 'red', rank: 3 },
      { suit: 'red', rank: 5 },
      { suit: 'red', rank: 7 },
      { suit: 'red', rank: 8 },
      { suit: 'red', rank: 10 },
    ];

    expect(scoreSuit(hand)).toEqual(65);
  });
});
