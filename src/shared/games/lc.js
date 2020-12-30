import { INVALID_MOVE, PlayerView, TurnOrder } from 'boardgame.io/core';
import { last, partition, range, sum } from '../utils';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/

/**
 * @typedef {object} Card
 * @property {string} suit
 * @property {number} rank
 *
 * @typedef {{
 *   [suit: string]: (Card & { turn: number })[],
 * }} Cards
 *
 * @typedef {{
 *   secret: {
 *     deck: Card[],
 *   },
 *   players: {
 *     [player: string]: {
 *       hand: Card[],
 *     },
 *   },
 *   played: {
 *     [player: string]: Cards,
 *   },
 *   discarded: Cards,
 *   deckSize: number,
 * }} GameState
 *
 * @typedef {{
 *   scores: {
 *     [player: string]: number[],
 *   },
 *   turnOrder: string[],
 * }} GameContext
 *
 * @typedef {GameState & GameContext} G
 */

const SUITS = ['yellow', 'blue', 'white', 'green', 'red' ];
const BETS = [-1, -2, -3];
const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const NUM_ROUNDS = 3;
const HAND_SIZE = 8;

const PLAYER_1 = '0';
const PLAYER_2 = '1';

/**
 * @param {Card} card
 * @returns {boolean}
 */
export function isBet(card) {
  return BETS.includes(card.rank);
}

/**
 * @param {Card} card
 * @returns {number}
 */
export function toOrdinal(card) {
  return (SUITS.indexOf(card.suit) + 1) * 100 + card.rank;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @returns {{ winner: string }?}
 */
function checkGameOver(G, ctx) {
  if (ctx.phase != null) {
    return undefined;
  }

  const player1Score = sum(G.scores[PLAYER_1]);
  const player2Score = sum(G.scores[PLAYER_2]);

  let winner;

  if (player1Score > player2Score) {
    winner = PLAYER_1;
  } else if (player2Score > player1Score) {
    winner = PLAYER_2;
  } else {
    winner = 'tied';
  }

  return { winner };
}

/**
 * @param {G} G
 */
function onRoundEnd(G) {
  for (const player of [PLAYER_1, PLAYER_2]) {
    const played = Object.values(Object.values(G.played[player]));
    const score = sum(played.map(cards => scoreSuit(cards)));
    G.scores[player].push(score);
  }

  const player1Score = sum(G.scores[PLAYER_1]);
  const player2Score = sum(G.scores[PLAYER_2]);

  if (player1Score > player2Score) {
    G.turnOrder = [PLAYER_1, PLAYER_2];
  } else if (player2Score > player1Score) {
    G.turnOrder = [PLAYER_2, PLAYER_1];
  } else {
    G.turnOrder = [G.turnOrder[1], G.turnOrder[0]];
  }
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @returns {G}
 */
function onRoundStart(G, ctx) {
  return { ...G, ...dealCards(ctx) };
}

/**
 * @param {G} G
 * @returns {G}
 */
function onTurnStart(G) {
  return { ...G, deckSize: G.secret.deck.length };
}

/**
 * @param {Card[]} cards
 * @returns {number}
 */
export function scoreSuit(cards) {
  if (cards.length === 0) {
    return 0;
  }

  const { true: bets, false: ranks } = partition(cards, card => isBet(card));

  const numBets = bets.length;
  const score = sum(ranks.map(card => card.rank));
  const bonus = cards.length >= 8 ? 20 : 0;

  return (score - 20) * (numBets + 1) + bonus;
}

/**
 * @param {Ctx} ctx
 * @returns {GameState}
 */
function dealCards(ctx) {
  const deck = ctx.random.Shuffle(
    SUITS.flatMap(suit => [
      ...RANKS.map(rank => ({ suit, rank })),
      ...BETS.map(rank => ({ suit, rank })),
    ])
  );

  const hand1 = [];
  const hand2 = [];

  for (let i = 0; i < HAND_SIZE; i++) {
    hand1.push(deck.pop());
    hand2.push(deck.pop());
  }

  const newCards = () => Object.fromEntries(SUITS.map(suit => [suit, []]));

  return {
    secret: {
      deck,
    },
    players: {
      [PLAYER_1]: {
        hand: hand1,
      },
      [PLAYER_2]: {
        hand: hand2,
      },
    },
    played: {
      [PLAYER_1]: newCards(),
      [PLAYER_2]: newCards(),
    },
    discarded: newCards(),
    deckSize: deck.length,
  };
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {Card} card
 * @returns {number}
 */
function findCardIndex(G, ctx, card) {
  return G.players[ctx.currentPlayer].hand.findIndex(({ rank, suit }) => rank === card.rank && suit === card.suit);
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {Card} card
 * @returns {string=}
 */
export function canPlayCardToBoard(G, ctx, card) {
  const i = findCardIndex(G, ctx, card);

  if (i === -1) {
    return 'card_not_in_player_hand';
  }

  const previousCard = last(G.played[ctx.currentPlayer][card.suit]);

  if (previousCard != null && !isBet(previousCard) && card.rank < previousCard.rank) {
    return 'card_out_of_order';
  }

  return undefined;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {Card} card
 * @returns {INVALID_MOVE=}
 */
function playCardToBoard(G, ctx, card) {
  if (canPlayCardToBoard(G, ctx, card) != null) {
    return INVALID_MOVE;
  }

  const i = findCardIndex(G, ctx, card);
  G.players[ctx.currentPlayer].hand.splice(i, 1);
  G.played[ctx.currentPlayer][card.suit].push({ ...card, turn: ctx.turn });
  ctx.events.setStage('drawCard');
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {Card} card
 * @returns {string=}
 */
export function canPlayCardToDiscard(G, ctx, card) {
  const i = findCardIndex(G, ctx, card);

  if (i === -1) {
    return 'card_not_in_player_hand';
  }

  return undefined;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {Card} card
 * @returns {INVALID_MOVE=}
 */
function playCardToDiscard(G, ctx, card) {
  if (canPlayCardToDiscard(G, ctx, card) != null) {
    return INVALID_MOVE;
  }

  const i = findCardIndex(G, ctx, card);
  G.players[ctx.currentPlayer].hand.splice(i, 1);
  G.discarded[card.suit].push({ ...card, turn: ctx.turn });
  ctx.events.setStage('drawCard');
}

/**
 * @param {G} G
 * @param {Ctx} _ctx
 * @returns {string=}
 */
export function canDrawCardFromDeck(G, _ctx) {
  if (G.deckSize === 0) {
    return 'deck_empty';
  }

  return undefined;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @returns {INVALID_MOVE=}
 */
function drawCardFromDeck(G, ctx) {
  if (canDrawCardFromDeck(G, ctx) != null) {
    return INVALID_MOVE;
  }

  const card = G.secret.deck.pop();
  G.players[ctx.currentPlayer].hand.push(card);
  ctx.events.endTurn();

  if (G.secret.deck.length === 0) {
    ctx.events.endPhase();
  }
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {string} suit
 * @returns {string=}
 */
export function canDrawCardFromDiscard(G, ctx, suit) {
  if (!SUITS.includes(suit)) {
    return 'unknown_discard_pile';
  }

  const card = last(G.discarded[suit]);

  if (card == null) {
    return 'cannot_draw_from_empty_discard_pile';
  }

  if (card.turn === ctx.turn) {
    return 'cannot_draw_just_discarded_card';
  }

  return undefined;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {string} suit
 * @returns {INVALID_MOVE?}
 */
function drawCardFromDiscard(G, ctx, suit) {
  if (canDrawCardFromDiscard(G, ctx, suit) != null) {
    return INVALID_MOVE;
  }

  const card = G.discarded[suit].pop();
  G.players[ctx.currentPlayer].hand.push(card);
  ctx.events.endTurn();
}

const game = {
  name: 'soaring-cities',

  minPlayers: 2,
  maxPlayers: 2,

  /**
   * @returns {GameContext}
   */
  setup: () => ({
    scores: {
      [PLAYER_1]: [],
      [PLAYER_2]: [],
    },
    turnOrder: [PLAYER_1, PLAYER_2],
  }),

  moves: {
    playCardToBoard: {
      move: playCardToBoard,
      client: false,
    },
    playCardToDiscard: {
      move: playCardToDiscard,
      client: false,
    },
  },

  turn: {
    onBegin: onTurnStart,

    order: TurnOrder.CUSTOM_FROM('turnOrder'),

    stages: {
      drawCard: {
        moves: {
          drawCardFromDeck: {
            move: drawCardFromDeck,
            client: false,
          },
          drawCardFromDiscard: {
            move: drawCardFromDiscard,
            client: false,
          },
        },
      },
    },
  },

  phases: Object.fromEntries(range(NUM_ROUNDS).map(i => ([
    `Round ${i + 1}`,
    {
      start: i === 0,
      next: i === NUM_ROUNDS - 1 ? undefined : `Round ${i + 2}`,
      onBegin: onRoundStart,
      onEnd: onRoundEnd,
    },
  ]))),

  endIf: checkGameOver,

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

export default game;
