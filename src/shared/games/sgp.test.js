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

xdescribe('Score Uramaki Rolls', () => {
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

  test('at end of round, tied', () => {
    const hands = [
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 4 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 4 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(8);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(8);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(5);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
    expect(scoreCard(hands[4][0], hands[4], removeAt(hands, 4), round)).toEqual(2);
  });

  test('during round', () => {
    const hands = [
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(8);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(5);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(2);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });

  test('during round and at end of round', () => {
    const hands = [
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 5 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 4 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Uramaki', category: 'Rolls', count: 3 },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(5);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(8);
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

  test('multiples played in round with desserts', () => {
    const hand = [
      { name: 'Pudding', category: 'Dessert', round: 1 },
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

    const round = 2;

    expect(scoreCard(hand[1], hand, otherHands, round)).toEqual(0);
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

describe('Score Onigiri Appetizer', () => {
  test('set of 2', () => {
    const hand = [
      { name: 'Onigiri', category: 'Appetizer', variants: ['circle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['triangle'] },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(4);
  });

  test('set of 1 and set of 3', () => {
    const hand = [
      { name: 'Onigiri', category: 'Appetizer', variants: ['circle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['triangle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['square'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['square'] },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(10);
  });

  test('set of 1, set of 2, and set of 4', () => {
    const hand = [
      { name: 'Onigiri', category: 'Appetizer', variants: ['circle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['triangle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['rectangle'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['square'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['square'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['square'] },
      { name: 'Onigiri', category: 'Appetizer', variants: ['circle'] },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(21);
  });
});

describe('Score Edamame Appetizer', () => {
  test('3 players with card', () => {
    const hands = [
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(2);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(2);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(2);
  });

  test('6 players with card', () => {
    const hands = [
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Edamame', category: 'Appetizer' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(4);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(4);
    expect(scoreCard(hands[4][0], hands[4], removeAt(hands, 4), round)).toEqual(4);
  });
});

describe('Score Wasabi Special', () => {
  test('with nigiri', () => {
    const hand = [
      { name: 'Wasabi', category: 'Special' },
      { name: 'Maki', category: 'Rolls' },
      { name: 'Salmon', category: 'Nigiri' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(6);
    expect(scoreCard(hand[2], hand, otherHands, round)).toEqual(0);
  });

  test('without nigiri', () => {
    const hand = [
      { name: 'Wasabi', category: 'Special' },
      { name: 'Maki', category: 'Rolls' },
      { name: 'Maki', category: 'Rolls' },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });
});

describe('Score Tea Special', () => {
  test('set of 4', () => {
    const hand = [
      { name: 'Tea', category: 'Special' },
      { name: 'Wasabi', category: 'Special' },
      { name: 'Soy Sauce', category: 'Special' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Salmon', category: 'Nigiri' },
      { name: 'Squid', category: 'Nigiri' },
      { name: 'Maki', category: 'Rolls', count: 3 },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(4)
  });

  test('set of 3, tied', () => {
    const hand = [
      { name: 'Tea', category: 'Special' },
      { name: 'Wasabi', category: 'Special' },
      { name: 'Soy Sauce', category: 'Special' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Salmon', category: 'Nigiri' },
      { name: 'Maki', category: 'Rolls', count: 4 },
      { name: 'Maki', category: 'Rolls', count: 3 },
    ];

    const otherHands = [];

    const round = 1;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(3)
  });
});

describe('Score Soy Sauce Special', () => {
  test('3 players', () => {
    const hands = [
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Maki', category: 'Rolls' },
        { name: 'Tempura', category: 'Appetizer' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(0);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
  });

  test('3 players, tied', () => {
    const hands = [
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 1;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(4);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
  });

  test('3 players, old cards', () => {
    const hands = [
      [
        { name: 'Pudding', category: 'Dessert', round: 1 },
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Maki', category: 'Rolls' },
        { name: 'Maki', category: 'Rolls' },
        { name: 'Maki', category: 'Rolls' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Soy Sauce', category: 'Special' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 2;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(0);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(4);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
  });
});

describe('Score Green Tea Ice Cream Dessert', () => {
  test('single set', () => {
    const hand = [
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 1 },
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 2 },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(12);
  });

  test('no sets', () => {
    const hand = [
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 1 },
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 2 },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });

  test('multiple sets', () => {
    const hand = [
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 1 },
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 2 },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(24);
  });

  test('before last round', () => {
    const hand = [
      { name: 'Green Tea Ice Cream', category: 'Dessert', round: 1 },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Egg', category: 'Nigiri' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
      { name: 'Green Tea Ice Cream', category: 'Dessert' },
    ];

    const otherHands = [];

    const round = 2;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(0);
  });
});

describe('Score Pudding Dessert', () => {
  test('2 players', () => {
    const hands = [
      [
        { name: 'Pudding', category: 'Dessert', round: 1 },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 3;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(0);
  });

  test('4 players', () => {
    const hands = [
      [
        { name: 'Pudding', category: 'Dessert', round: 1 },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 3;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(-6);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(0);
  });

  test('4 players, tied', () => {
    const hands = [
      [
        { name: 'Pudding', category: 'Dessert', round: 1 },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Pudding', category: 'Dessert' },
      ],
    ];

    const round = 3;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(6);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(-6);
    expect(scoreCard(hands[2][0], hands[2], removeAt(hands, 2), round)).toEqual(0);
    expect(scoreCard(hands[3][0], hands[3], removeAt(hands, 3), round)).toEqual(6);
  });

  test('before last round', () => {
    const hands = [
      [
        { name: 'Pudding', category: 'Dessert', round: 1 },
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
      ],
      [
        { name: 'Pudding', category: 'Dessert' },
        { name: 'Egg', category: 'Nigiri' },
        { name: 'Egg', category: 'Nigiri' },
      ],
    ];

    const round = 2;

    expect(scoreCard(hands[0][0], hands[0], removeAt(hands, 0), round)).toEqual(0);
    expect(scoreCard(hands[1][0], hands[1], removeAt(hands, 1), round)).toEqual(0);
  });
});

xdescribe('Score Fruit Dessert', () => {
  test('1 orange, 4 pineapple, 0 watermelon', () => {
    const hand = [
      { name: 'Fruit', category: 'Dessert', variants: ['pineapple', 'pineapple'], round: 1 },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'pineapple'] },
      { name: 'Fruit', category: 'Dessert', variants: ['pineapple'] },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(4);
  });

  test('5 orange, 3 pineapple, 2 watermelon', () => {
    const hand = [
      { name: 'Fruit', category: 'Dessert', variants: ['pineapple', 'pineapple'], round: 1 },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'pineapple'] },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'orange'] },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'orange'] },
      { name: 'Fruit', category: 'Dessert', variants: ['watermelon', 'watermelon'] },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(14);
  });

  test('6 orange, 0 pineapple, 0 watermelon', () => {
    const hand = [
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'orange'], round: 1 },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'orange'] },
      { name: 'Fruit', category: 'Dessert', variants: ['orange', 'orange'] },
    ];

    const otherHands = [];

    const round = 3;

    expect(scoreCard(hand[0], hand, otherHands, round)).toEqual(6);
  });
});
