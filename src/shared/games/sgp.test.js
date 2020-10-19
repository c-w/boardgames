import { scoreCard } from './sgp';
import { range, removeAt } from '../utils';

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

describe('Score Maki Rolls', () => {
  test('4 players', () => {
    const hands = [
      [
        { name: 'Maki', category: 'Rolls', count: 3 },
        { name: 'Maki', category: 'Rolls', count: 2 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 2 },
        { name: 'Maki', category: 'Rolls', count: 1 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 2 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(3);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });

  test('4 players, tied', () => {
    const hands = [
      [
        { name: 'Maki', category: 'Rolls', count: 3 },
        { name: 'Maki', category: 'Rolls', count: 2 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 3 },
        { name: 'Maki', category: 'Rolls', count: 2 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 2 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(6);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(3);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });

  test('6 players', () => {
    const hands = [
      [
        { name: 'Maki', category: 'Rolls', count: 3 },
        { name: 'Maki', category: 'Rolls', count: 2 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 2 },
        { name: 'Maki', category: 'Rolls', count: 1 },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 2 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Maki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(2);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });
});

describe('Score Temaki Rolls', () => {
  test('2 players', () => {
    const hands = [
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(0);
  });

  test('4 players', () => {
    const hands = [
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(-4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });

  test('4 players, tied', () => {
    const hands = [
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
        { name: 'Temaki', category: 'Rolls', count: 1 },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(-4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(4);
  });
});

describe('Score Uramaki Rolls', () => {
  test('at end of round', () => {
    const hands = [
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 4 },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(8);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(5);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(2);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });
});

describe('Score Tempura Appetizer', () => {
  test('single set', () => {
    const hand = [
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Tempura', category: 'Appetizer' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(5);
  });

  test('no sets', () => {
    const hand = [
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });

  test('multiple sets', () => {
    const hand = [
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Tempura', category: 'Appetizer' },
      { name: 'Tempura', category: 'Appetizer' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(10);
  });
});

describe('Score Sashimi Appetizer', () => {
  test('single set', () => {
    const hand = [
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(10);
  });

  test('no sets', () => {
    const hand = [
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Sashimi', category: 'Appetizer' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });

  test('multiple sets', () => {
    const hand = [
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
      { name: 'Sashimi', category: 'Appetizer' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(20);
  });
});

describe('Score Miso Soup Appetzier', () => {
  test('one played in round', () => {
    const hand = [
      { name: 'Miso Soup', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
    ];

    const otherHands = [
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(3);
  });

  test('multiples played in round', () => {
    const hand = [
      { name: 'Miso Soup', category: 'Appetizer' },
      { name: 'Egg', category: 'Nigiri' },
    ];

    const otherHands = [
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Miso Soup', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });
});

describe('Score Tofu Appetizer', () => {
  test.each([
    [1, 2],
    [2, 6],
    [3, 0],
  ])('%sx', (count, expected) => {
    const hand = [
      ...range(count).map(_ => ({ name: 'Tofu', category: 'Appetizer' })),
      ...range(5 - count).map(_ => ({ name: 'Egg', category: 'Nigiri' })),
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(expected);
  });
});

describe('Score Eel Appetizer', () => {
  test.each([
    [1, -3],
    [2, 7],
    [3, 7],
  ])('%sx', (count, expected) => {
    const hand = [
      ...range(count).map(_ => ({ name: 'Eel', category: 'Appetizer' })),
      ...range(5 - count).map(_ => ({ name: 'Egg', category: 'Nigiri' })),
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(expected);
  });
});

describe('Score Dumpling Appetizer', () => {
  test.each([
    [1, 1],
    [2, 3],
    [3, 6],
    [4, 10],
    [5, 15],
    [6, 15],
  ])('%sx', (count, expected) => {
    const hand = [
      ...range(count).map(_ => ({ name: 'Dumpling', category: 'Appetizer' })),
      ...range(10 - count).map(_ => ({ name: 'Egg', category: 'Nigiri' })),
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(expected);
  });
});
