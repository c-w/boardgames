import { scoreCard } from './sgp';
import { removeAt } from '../utils';

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
