import { PlayerView, INVALID_MOVE, Stage } from 'boardgame.io/core';
import { distinct, getRandomInt, last, pairs, range, removeAt, sum } from '../utils.js';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/packages/core').INVALID_MOVE} INVALID_MOVE **/

/**
 * @typedef {{
 *   name: string,
 *   category: string,
 *   scored?: boolean,
 *   count?: number,
 *   variants?: string[],
 * }} Card
 *
 * @typedef {{
 *   secret: {
 *     deck: Card[],
 *     desserts: Card[],
 *   },
 *   players: {
 *     [player: string]: {
 *       hand: Card[],
 *       picked?: Card,
 *     },
 *   },
 *   played: {
 *     [player: string]: Card[],
 *   },
 * }} GameState
 *
 * @typedef {{
 *   scores: {
 *     [player: string]: number[],
 *   },
 *   startingPlayer: string,
 *   setupData: SetupData,
 * }} GameContext
 *
 * @typedef {GameState & GameContext} G
 *
 * @typedef {{
 *   rolls: string,
 *   appetizer1: string,
 *   appetizer2: string,
 *   appetizer3: string,
 *   special1: string,
 *   special2: string,
 *   dessert: string,
 * }} SetupData
 */

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const NUM_ROUNDS = 3;

const ONIGIRI_VARIANTS = [
  'square',
  'circle',
  'triangle',
  'rectangle',
];

const FRUITS = [
  'watermelon',
  'pineapple',
  'peach',
];

const FRUIT_VARIANTS = [
  ...range(2).map(_ => FRUITS.map(variant => ([variant, variant]))).flat(),
  ...range(3).map(_ => pairs(FRUITS)).flat(),
];

const CATEGORIES = {
  dessert: 'Dessert',
  appetizer: 'Appetizer',
  roll: 'Rolls',
  nigiri: 'Nigiri',
  special: 'Special',
};

const NIGIRIS = {
  egg: 'Egg',
  salmon: 'Salmon',
  squid: 'Squid',
};

const ROLLS = {
  maki: 'Maki',
  temaki: 'Temaki',
};

const APPETIZERS = {
  tempura: 'Tempura',
  sashimi: 'Sashimi',
  misoSoup: 'Miso Soup',
  tofu: 'Tofu',
  eel: 'Eel',
  dumpling: 'Dumpling',
  onigiri: 'Onigiri',
};

const SPECIALS = {
  wasabi: 'Wasabi',
  tea: 'Tea',
  soySauce: 'Soy Sauce',
};

const DESSERTS = {
  greenTeaIceCream: 'Green Tea Ice Cream',
  pudding: 'Pudding',
  fruit: 'Fruit',
};

/**
 * @param {Card} card
 * @param {Card[]} hand
 * @param {Card[][]} otherHands
 * @param {number} numRound
 * @param {number} numPlayers
 * @returns {number}
 */
function scoreCard(card, hand, otherHands, numRound, numPlayers) {
  if (card.scored) {
    return 0;
  }

  if (card.category === CATEGORIES.dessert && numRound !== NUM_ROUNDS) {
    return 0;
  }

  /**
   * @param {Card[]} cards
   * @returns {Card[]}
   */
  const getSetInstances = cards => cards.filter(({ name }) => name === card.name);

  /**
   * @param {Card[]} cards
   * @returns {number}
   */
  const getNumRolls = cards => sum(getSetInstances(cards).map(({ count }) => count));

  /**
   * @param {Card[]} cards
   * @returns {number}
   */
  const getNumCategories = cards => distinct(cards.map(({ category }) => category)).length;

  let setSize = undefined;
  let setValue = undefined;
  let scoreSet = false;

  let score = 0;

  switch (card.name) {
    case NIGIRIS.egg:
      score = 1;
      break;

    case NIGIRIS.salmon:
      score = 2;
      break;

    case NIGIRIS.squid:
      score = 3;
      break;

    case ROLLS.maki:
      {
        const numMakis = getNumRolls(hand);
        const otherNumMakis = otherHands.map(otherHand => getNumRolls(otherHand));
        const allNumMakis = distinct(numMakis, ...otherNumMakis).sort().reverse();
        const mostMakis = allNumMakis[0];
        const secondMostMakis = allNumMakis[1];

        if (numPlayers <= 5) {
          if (numMakis === mostMakis) {
            score = 6;
          } else if (numMakis === secondMostMakis) {
            score = 3;
          } else {
            score = 0;
          }
        } else {
          const thirdMostMakis = allNumMakis[2];

          if (numMakis === mostMakis) {
            score = 6;
          } else if (numMakis === secondMostMakis) {
            score = 4;
          } else if (numMakis === thirdMostMakis) {
            score = 2;
          } else {
            score = 0;
          }
        }

        scoreSet = true;
      }
      break;

    case ROLLS.temaki:
      {
        const numTemakis = getNumRolls(hand);
        const otherNumTemakis = otherHands.map(otherHand => getNumRolls(otherHand));
        const allNumTemakis = distinct(numTemakis, ...otherNumTemakis).sort().reverse();
        const mostTemakis = allNumTemakis[0];
        const leastTemakis = last(allNumTemakis);

        if (numTemakis === mostTemakis) {
          score = 4;
        }

        if (numPlayers > 2) {
          if (numTemakis === leastTemakis) {
            score = -4;
          }
        }

        scoreSet = true;
      }
      break;

    case APPETIZERS.tempura:
      setSize = 2;
      setValue = 5;
      break;

    case APPETIZERS.sashimi:
      setSize = 3;
      setValue = 10;
      break;

    case APPETIZERS.misoSoup:
      {
        const turnPlayed = hand.indexOf(card);
        const hasOtherMisoSoup = otherHands.some(otherHand => otherHand[turnPlayed].name === APPETIZERS.misoSoup);
        score = hasOtherMisoSoup ? 0 : 3;
      }
      break;

    case APPETIZERS.tofu:
      {
        const numTofus = getSetInstances(hand).length;

        if (numTofus === 1) {
          score = 2;
        } else if (numTofus === 2) {
          score = 6;
        } else if (numTofus >= 3) {
          score = 0;
        }

        scoreSet = true;
      }
      break;

    case APPETIZERS.eel:
      {
        const numEels = getSetInstances(hand).length;

        if (numEels === 1) {
          score = -3;
        } else if (numEels >= 2) {
          score = 7;
        }

        scoreSet = true;
      }
      break;

    case APPETIZERS.dumpling:
      {
        const numDumplings = getSetInstances(hand).length;

        if (numDumplings === 1) {
          score = 1;
        } else if (numDumplings === 2) {
          score = 3;
        } else if (numDumplings === 3) {
          score = 6;
        } else if (numDumplings === 4) {
          score = 10;
        } else if (numDumplings >= 5) {
          score = 15;
        }

        scoreSet = true;
      }
      break;

    case APPETIZERS.onigiri:
      {
        const counts = Object.fromEntries(ONIGIRI_VARIANTS.map(type => [type, 0]));

        for (const card of getSetInstances(hand)) {
          counts[card.variants[0]]++;
        }

        while (true) {
          const uniques = Object.entries(counts).filter(([_, count]) => count > 0).map(([shape, _]) => shape);
          const numUniques = uniques.length;

          if (numUniques === 0) {
            break;
          } else if (numUniques === 4) {
            score += 16;
          } else if (numUniques === 3) {
            score += 9
          } else if (numUniques === 2) {
            score += 4;
          } else if (numUniques === 1) {
            score += 1;
          }

          for (const shape of uniques) {
            counts[shape]--;
          }
        }

        scoreSet = true;
      }
      break;

    case SPECIALS.wasabi:
      {
        const turnPlayed = hand.indexOf(card);
        const nextNigiri = hand.slice(turnPlayed).filter(otherCard => otherCard.category === CATEGORIES.nigiri)[0];

        if (nextNigiri == null) {
          score = 0;
        } else {
          score = scoreCard(nextNigiri, hand, otherHands, numRound, numPlayers) * 3;
        }
      }
      break;

    case SPECIALS.tea:
      {
        const counts = {};

        for (const card of hand) {
          counts[card.category] = (counts[card.category] || 0) + 1;
        }

        score = Math.max(...Object.values(counts));
      }
      break;

    case SPECIALS.soySauce:
      {
        const numCategories = getNumCategories(hand);
        const otherNumCategories = otherHands.map(otherHand => getNumCategories(otherHand));
        const allNumCategories = distinct(numCategories, ...otherNumCategories).sort().reverse();
        const mostCategories = allNumCategories[0];

        if (numCategories === mostCategories) {
          score = 4;
        }
      }
      break;

    case DESSERTS.greenTeaIceCream:
      setSize = 4;
      setValue = 12;
      break;

    case DESSERTS.pudding:
      {
        const numPuddings = getSetInstances(hand).length;
        const otherNumPuddings = otherHands.map(otherHand => getSetInstances(otherHand).length);
        const allNumPuddings = distinct(numPuddings, ...otherNumPuddings).sort().reverse();
        const mostPuddings = allNumPuddings[0];
        const leastPuddings = last(allNumPuddings);

        if (numPuddings === mostPuddings) {
          score = 6;
        }

        if (numPlayers > 2) {
          if (numPuddings === leastPuddings) {
            score = -6;
          }
        }

        scoreSet = true;
      }
      break;

    case DESSERTS.fruit:
      {
        const counts = Object.fromEntries(FRUITS.map(variant => [variant, 0]));

        for (const card of getSetInstances(hand)) {
          for (const variant of card.variants) {
            counts[variant]++;
          }
        }

        for (const count of Object.values(counts)) {
          if (count === 0) {
            score -= 2;
          } else if (count === 1) {
            score += 0;
          } else if (count === 2) {
            score += 1;
          } else if (count === 3) {
            score += 3;
          } else if (count === 4) {
            score += 6;
          } else if (count >= 5) {
            score += 10;
          }
        }

        scoreSet = true;
      }
      break;

    default:
      throw new Error(`Unknown card: ${card.name}`);
  }

  if (setValue != null && setSize != null) {
    const setInstances = getSetInstances(hand);
    score = Math.floor(setInstances.length / setSize) * setValue;
    scoreSet = true;
  }

  if (scoreSet) {
    const setInstances = getSetInstances(hand);

    for (const otherCard of setInstances) {
      otherCard.scored = true;
    }
  } else {
    card.scored = true;
  }

  return score;
}

/**
 * @param {number} numPlayers
 * @returns {number}
 */
function getHandSize(numPlayers) {
  switch (numPlayers) {
    case 2:
    case 3:
      return 10;

    case 4:
    case 5:
      return 9;

    case 6:
    case 7:
      return 8;

    case 8:
      return 7;

    default:
      throw new Error(`Unknown player count: ${numPlayers}`);
  }
}

/**
 * @param {number} numPlayers
 * @param {number} numRound
 * @returns {number}
 */
function getNumDesserts(numPlayers, numRound) {
  switch (numPlayers) {
    case 2:
    case 3:
    case 4:
    case 5:
      switch (numRound) {
        case 1:
          return 5;

        case 2:
          return 3;

        case 3:
          return 2;

        default:
          throw new Error(`Unknown round number: ${numRound}`);
      }

    case 6:
    case 7:
    case 8:
      switch (numRound) {
        case 1:
          return 7;

        case 2:
          return 5;

        case 3:
          return 3;

        default:
          throw new Error(`Unknown round number: ${numRound}`);
      }

    default:
      throw new Error(`Unknown player count: ${numPlayers}`);
  }
}

/**
 * @param {G?} G
 * @param {Ctx} ctx
 * @param {SetupData} setupData
 * @returns {{ deck: Card[], desserts: Card[]}}
 */
function getDeck(G, ctx, setupData) {
  setupData = G?.setupData || setupData;

  let rolls = [];

  switch (setupData.rolls) {
    case ROLLS.maki:
      rolls = [
        ...range(4).map(_ => ({ category: CATEGORIES.roll, name: ROLLS.maki, count: 1 })),
        ...range(5).map(_ => ({ category: CATEGORIES.roll, name: ROLLS.maki, count: 2 })),
        ...range(3).map(_ => ({ category: CATEGORIES.roll, name: ROLLS.maki, count: 3 })),
      ];
      break;

    case ROLLS.temaki:
      rolls = range(12).map(_ => ({ category: CATEGORIES.roll, name: ROLLS.temaki, count: 1 }));
      break;

    default:
      throw new Error(`Unknown rolls: ${setupData.rolls}`);
  }

  const appetizers = [setupData.appetizer1, setupData.appetizer2, setupData.appetizer3];
  const specials = [setupData.special1, setupData.special2];

  let deck;

  if (G?.secret?.deck) {
    deck = G.secret.deck.filter(card => card.category === CATEGORIES.dessert);
  } else {
    deck = [];
  }

  let desserts;

  if (G?.secret?.desserts) {
    desserts = [...G.secret.desserts];
  } else {
    desserts = ctx.random.Shuffle(
      range(15).map(i => {
        const dessert = {
          category: CATEGORIES.dessert,
          name: setupData.dessert,
        };

        if (dessert.name === DESSERTS.fruit) {
          dessert.variants = FRUIT_VARIANTS[i];
        }

        return dessert;
      })
    );
  }

  deck = deck.concat([
    ...range(4).map(_ => ({ category: CATEGORIES.nigiri, name: NIGIRIS.egg })),
    ...range(5).map(_ => ({ category: CATEGORIES.nigiri, name: NIGIRIS.salmon })),
    ...range(3).map(_ => ({ category: CATEGORIES.nigiri, name: NIGIRIS.squid })),
    ...rolls,
    ...appetizers.map(name => range(8).map(i => {
        const appetizer = {
          category: CATEGORIES.appetizer,
          name,
        };

        if (appetizer.name === APPETIZERS.onigiri) {
          appetizer.variants = [ONIGIRI_VARIANTS[i % ONIGIRI_VARIANTS.length]];
        }

        return appetizer;
      })).flat(),
    ...specials.map(name => range(3).map(_ => ({ category: CATEGORIES.special, name }))).flat(),
  ]);

  const numDesserts = getNumDesserts(ctx.numPlayers, getNumRound(ctx));

  for (let i = 0; i < numDesserts; i++) {
    deck.push(desserts.pop());
  }

  return {
    deck: ctx.random.Shuffle(deck),
    desserts,
  };
}

/**
 * @param {Ctx} ctx
 * @returns {number}
 */
export function getNumRound(ctx) {
  const handSize = getHandSize(ctx.numPlayers);
  const turn = ctx.turn === 0 ? ctx.turn : ctx.turn - 1;
  return Math.floor(turn / handSize) + 1;
}

/**
 * @param {G?} G
 * @param {Ctx} ctx
 * @param {SetupData?} setupData
 * @returns {GameState}
 */
function dealCards(G, ctx, setupData=null) {
  const { deck, desserts } = getDeck(G, ctx, setupData);

  const players = Object.fromEntries(range(ctx.numPlayers).map(i => ([
    i,
    {
      hand: range(getHandSize(ctx.numPlayers)).map(_ => {
        const card = deck.pop();

        if (card == null) {
          throw new Error(`Not enough cards in deck for player ${i}`);
        }

        return card;
      }),
    },
  ])));

  const played = G?.played
    ? Object.fromEntries(Object.entries(G.played).map(([playerID, played]) => [
        playerID,
        played.filter(card => card.category === CATEGORIES.dessert),
      ]))
    : Object.fromEntries(range(ctx.numPlayers).map(playerID => ([
        playerID,
        [],
      ])));

  return {
    secret: {
      deck,
      desserts,
    },
    players,
    played,
  };
}

/**
 * @param {G} G
 * @param {Ctx} _ctx
 * @returns {boolean}
 */
function isRoundOver(G, _ctx) {
  return Object.values(G.players).every(player => player.hand.length === 0);
}

/**
 * @param {G} G
 * @param {Ctx} _ctx
 * @returns {boolean}
 */
function isTurnOver(G, _ctx) {
  return Object.values(G.players).every(player => player.picked != null);
}

/**
 * @param {G} G
 * @returns {{ winner: string }}
 */
function getWinner(G) {
  const [first, ...playerScores] = Object.entries(G.scores).map(([playerID, scores]) => ({ playerID, score: sum(scores) }));
  let winner = first.playerID;
  let bestScore = first.score;

  const numDesserts = Object.fromEntries(Object.entries(G.played).map(([playerID, played]) => [
    playerID,
    played.filter(card => card.category === CATEGORIES.dessert).length,
  ]));

  for (const { playerID, score } of playerScores) {
    if (score > bestScore || (score === bestScore && numDesserts[playerID] > numDesserts[winner])) {
      bestScore = score;
      winner = playerID;
    }
  }

  return { winner };
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 */
function onTurnEnd(G, ctx) {
  for (const [playerID, player] of Object.entries(G.players)) {
    G.played[playerID].push(player.picked);
    G.players[playerID].picked = undefined;
  }

  if (isRoundOver(G, ctx)) {
    const numRound = getNumRound(ctx);

    for (const [playerID, played] of Object.entries(G.played)) {
      const otherHands = Object.entries(G.played).filter(([id, _]) => id !== playerID).map(([_, hand]) => hand);

      const score = sum(played.map(card => scoreCard(card, played, otherHands, numRound, ctx.numPlayers)));

      G.scores[playerID].push(score);
    }

    if (numRound === NUM_ROUNDS) {
      const winner = getWinner(G);
      ctx.events.endGame(winner);
    } else {
      for (const [key, value] of Object.entries(dealCards(G, ctx))) {
        G[key] = value;
      }
    }
  } else {
    const newHands = {};

    for (const [playerID, player] of Object.entries(G.players)) {
      newHands[(Number(playerID) + 1) % ctx.numPlayers] = player.hand;
    }

    for (const [playerID, hand] of Object.entries(newHands)) {
      G.players[playerID] = { hand };
    }
  }
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number?} i
 * @returns {string?}
 */
function isPickInvalid(G, ctx, i) {
  const player = G.players[ctx.playerID];

  if (i == null) {
    return 'played_no_card';
  }

  if (i >= player.hand.length) {
    return 'played_unknown_card';
  }

  if (player.picked != null) {
    return 'played_card_already';
  }
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number} i
 * @returns {INVALID_MOVE?}
 */
function pickCard(G, ctx, i) {
  if (isPickInvalid(G, ctx, i)) {
    return INVALID_MOVE;
  }

  const player = G.players[ctx.playerID];

  player.picked = player.hand[i];
  player.hand = removeAt(player.hand, i);
}

export default {
  name: 'sgp',

  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS,

  setupDataSchema: {
    required: [
      'numPlayers',
      'rolls',
      'appetizer1',
      'appetizer2',
      'appetizer3',
      'special1',
      'special2',
      'dessert',
    ],
    properties: Object.fromEntries([
      [
        'numPlayers',
        {
          title: 'Number of players',
          type: 'integer',
          minimum: MIN_PLAYERS,
          maximum: MAX_PLAYERS,
          default: MIN_PLAYERS,
        },
      ],
      [
        'rolls',
        {
          title: 'Rolls',
          type: 'string',
          enum: Object.values(ROLLS),
          default: Object.values(ROLLS)[0],
        },
      ],
      ...range(3).map(i => ([
        `appetizer${i + 1}`,
        {
          title: `Appetizer ${i + 1}`,
          type: 'string',
          enum: Object.values(APPETIZERS),
          default: Object.values(APPETIZERS)[i],
        },
      ])),
      ...range(2).map(i => ([
        `special${i + 1}`,
        {
          title: `Special ${i + 1}`,
          type: 'string',
          enum: Object.values(SPECIALS),
          default: Object.values(SPECIALS)[i],
        },
      ])),
      [
        'dessert',
        {
          title: 'Dessert',
          type: 'string',
          enum: Object.values(DESSERTS),
          default: Object.values(DESSERTS)[0],
        },
      ],
    ]),
  },

  /**
   * @param {Ctx} ctx
   * @param {SetupData} setupData
   * @returns {G}
   */
  setup: (ctx, setupData) => ({
    ...dealCards(null, ctx, setupData),
    scores: Object.fromEntries(range(ctx.numPlayers).map(i => [`${i}`, []])),
    startingPlayer: `${getRandomInt(ctx.numPlayers + 1)}`,
    setupData,
  }),

  moves: {
    pickCard: {
      move: pickCard,
      client: false,
    },
  },

  turn: {
    activePlayers: {
      all: Stage.NULL,
      moveLimit: 1,
    },
    endIf: isTurnOver,
    onEnd: onTurnEnd,
  },

  playerView: PlayerView.STRIP_SECRETS,

  events: {
    endStage: false,
    endTurn: false,
    endPhase: false,
    endGame: false,
    setStage: false,
    setPhase: false,
    setActivePlayers: false,
  },

  disableUndo: true,
};
