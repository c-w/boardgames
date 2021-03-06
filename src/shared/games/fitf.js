import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import { last, removeAt, sum } from '../utils.js';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/packages/core').INVALID_MOVE} INVALID_MOVE **/

/**
 * @typedef {{
 *  suit: string,
 *  rank: number,
 * }} Card
 *
 * @typedef {{
 *   winner: string,
 *   cards: Array<Card & { playerID: string }>,
 * }[]} Tricks
 *
 * @typedef {{
 *   secret: {
 *     deck: Card[],
 *   },
 *   tricks: Tricks,
 *   trumps: (Card & { turn: number })[],
 *   players: {
 *     [player: string]: {
 *       hand: Card[],
 *       stashed?: Card,
 *     },
 *   },
 * }} GameState
 *
 * @typedef {{
 *   played?: Card,
 *   scores: {
 *     [player: string]: number[],
 *   },
 *   history: Tricks[],
 *   startingPlayer: string,
 *   winningScore: number,
 * }} GameContext
 *
 * @typedef {GameState & GameContext} G
 *
 * @typedef {{
 *   longGame?: boolean,
 * }} SetupData
 */

const SUITS = ['key', 'tower', 'moon'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const LONG_GAME_WINNING_SCORE = 21;
const SHORT_GAME_WINNING_SCORE = 16;
const HAND_SIZE = 13;
const PLAYER_1 = '0';
const PLAYER_2 = '1';

/**
 * @param {Ctx} ctx
 * @returns {GameState}
 */
function dealCards(ctx) {
  const deck = ctx.random.Shuffle(
    SUITS.map(suit => RANKS.map(rank => ({ suit, rank }))).flat()
  );

  const trumps = [{ ...deck.pop(), turn: 0 }];

  const hand1 = [];
  const hand2 = [];

  for (let i = 0; i < HAND_SIZE; i++) {
    hand1.push(deck.pop());
    hand2.push(deck.pop());
  }

  return {
    secret: {
      deck,
    },
    tricks: [],
    trumps,
    players: {
      [PLAYER_1]: {
        hand: hand1,
        stashed: null,
      },
      [PLAYER_2]: {
        hand: hand2,
        stashed: null,
      },
    },
  };
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number?} i
 * @returns {{
 *   opponentID: string,
 *   playerID: string,
 *   hand: Card[],
 *   card: Card,
 * }}
 */
function getPlayers(G, ctx, i=null) {
  const playerID = ctx.currentPlayer;
  const opponentID = playerID === PLAYER_1 ? PLAYER_2 : PLAYER_1;

  const hand = [...G.players[playerID].hand];

  const card = i == null
    ? { ...G.players[playerID].stashed }
    : hand[i];

  return {
    opponentID,
    playerID,
    hand,
    card,
  };
}

/**
 * @param {Tricks} tricks
 * @returns {number}
 */
function calculateScore(tricks) {
  const tricksWon = tricks.length;

  let roundScore;

  if (tricksWon <= 3) {
    roundScore = 6;
  } else if (tricksWon === 4) {
    roundScore = 1;
  } else if (tricksWon === 5) {
    roundScore = 2;
  } else if (tricksWon === 6) {
    roundScore = 3;
  } else if (tricksWon >= 7 && tricksWon <= 9) {
    roundScore = 6;
  } else {
    roundScore = 0;
  }

  const extraScore = tricks.map(t => t.cards).flat().filter(c => c.rank === 7).length;

  return roundScore + extraScore;
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @returns {{ winner: string }?}
 */
function checkGameOver(G, ctx) {
  const { playerID, opponentID } = getPlayers(G, ctx);

  const playerScores = G.scores[playerID];
  const opponentScores = G.scores[opponentID];

  const playerScore = sum(playerScores);
  const opponentScore = sum(opponentScores);

  if (playerScore < G.winningScore && opponentScore < G.winningScore) {
    return;
  }

  if (playerScore > opponentScore) {
    return { winner: playerID };
  }

  if (opponentScore > playerScore) {
    return { winner: opponentID };
  }

  return last(playerScores) > last(opponentScores)
    ? { winner: playerID }
    : { winner: opponentID };
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number} i
 */
function discardCard(G, ctx, i) {
  const { playerID, hand } = getPlayers(G, ctx);

  G.players[playerID].hand = removeAt(hand, i);

  ctx.events.endStage();

  playCard(G, ctx);
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param  {...number} cards
 * @returns {string}
 */
export function isMoveInvalid(G, ctx, ...cards) {
  if (cards.length > 2) {
    return 'played_too_many_cards';
  }

  const [i, j] = cards;
  const { playerID, hand, card } = getPlayers(G, ctx, i);

  if (i == null && G.players[playerID].stashed == null) {
    return 'played_no_card';
  }

  if (card == null) {
    return 'played_unknown_card';
  }

  if (ctx.activePlayers && ctx.activePlayers[playerID] === 'discard') {
    if (j != null) {
      return 'discarded_extra_card';
    }

    return;
  }

  if (j != null) {
    if (card.rank !== 3) {
      return 'played_extra_card';
    }

    if (hand[j] == null) {
      return 'played_unknown_extra_card';
    }
  }

  if (G.played != null) {
    const canFollowSuit = removeAt(hand, i).some(c => c.suit === G.played.suit);

    if (card.suit !== G.played.suit && canFollowSuit) {
      return 'must_follow_suit';
    }

    const highestRankInSuit = hand
      .filter(c => c.suit === G.played.suit)
      .map(c => c.rank)
      .reduce((max, rank) => max < rank ? rank : max, -1);

    if (G.played.rank === 11 && card.rank !== 1 && card.rank !== highestRankInSuit && highestRankInSuit !== -1) {
      return 'must_follow_11';
    }
  }
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number} i
 * @returns {{ winner: string, next: string }}
 */
function determineTrickWinner(G, ctx, i) {
  const { playerID, opponentID, card } = getPlayers(G, ctx, i);

  const trumpSuit = last(G.trumps).suit;

  let { rank, suit } = card;
  let opponentRank = G.played.rank;
  let opponentSuit = G.played.suit;

  if ((rank === 9 || opponentRank === 9) && !(rank === 9 && opponentRank === 9)) {
    if (rank === 9) {
      suit = trumpSuit;
    } else if (opponentRank === 9) {
      opponentSuit = trumpSuit;
    }
  }

  let winner;

  if (suit === trumpSuit && opponentSuit !== trumpSuit) {
    winner = playerID;
  } else if (suit !== trumpSuit && opponentSuit === trumpSuit) {
    winner = opponentID;
  } else if (suit !== opponentSuit) {
    winner = opponentID;
  } else {
    winner = rank > opponentRank ? playerID : opponentID;
  }

  let next;

  if (opponentRank === 1 && winner !== opponentID) {
    next = opponentID;
  } else if (rank === 1 && winner !== playerID) {
    next = playerID;
  } else {
    next = winner;
  }

  return { winner, next };
}

/**
 * @param {G} G
 * @param {Ctx} ctx
 * @param {number?} i
 * @param {number?} j
 * @returns {INVALID_MOVE?}
 */
function playCard(G, ctx, i=null, j=null) {
  if (isMoveInvalid(G, ctx, i, j)) {
    return INVALID_MOVE;
  }

  const { playerID, opponentID, hand, card } = getPlayers(G, ctx, i);

  if (card.rank === 3 && j != null) {
    const oldTrump = { ...last(G.trumps) };
    G.trumps.push({ ...hand[j], turn: ctx.turn });
    hand[j] = oldTrump;
  }

  const newHand = removeAt(hand, i);

  if (card.rank === 5 && G.players[playerID].stashed == null && newHand.length !== 0) {
    const newCard = G.secret.deck.pop();

    G.players[playerID].hand = [...newHand, newCard];
    G.players[playerID].stashed = card;

    ctx.events.setStage('discard');
    return;
  }

  if (G.played == null) {
    G.players[playerID].stashed = null;
    G.players[playerID].hand = newHand;
    G.played = card;
    ctx.events.endTurn();
    return;
  }

  let { winner, next } = determineTrickWinner(G, ctx, i);

  G.tricks.push({ winner, cards: [{ ...G.played, playerID: opponentID }, { ...card, playerID }] });
  G.played = null;
  G.players[playerID].stashed = null;
  G.players[playerID].hand = newHand;

  if (newHand.length === 0) {
    for (const id of [playerID, opponentID]) {
      const tricks = G.tricks.filter(t => t.winner === id);
      const score = calculateScore(tricks);
      G.scores[id].push(score);
    }

    const newRound = dealCards(ctx);
    G.history.push(G.tricks);
    G.secret = newRound.secret;
    G.tricks = newRound.tricks;
    G.trumps = newRound.trumps;
    G.players = newRound.players;
    next = G.startingPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    G.startingPlayer = next;
  }

  ctx.events.endTurn({ next });
}

const game = {
  name: 'the-vole-in-the-valley',

  minPlayers: 2,
  maxPlayers: 2,

  setupDataSchema: {
    required: [],
    properties: {
      longGame: {
        title: 'Long game',
        type: 'boolean',
      },
    },
  },

  /**
   * @param {Ctx} ctx
   * @param {SetupData?} setupData
   * @returns {G}
   */
  setup: (ctx, setupData) => ({
    ...dealCards(ctx),
    played: null,
    scores: {
      [PLAYER_1]: [],
      [PLAYER_2]: [],
    },
    history: [],
    startingPlayer: PLAYER_1,
    winningScore: setupData?.longGame
      ? LONG_GAME_WINNING_SCORE
      : SHORT_GAME_WINNING_SCORE,
  }),

  moves: {
    playCard: {
      move: playCard,
      client: false,
    },
  },

  turn: {
    stages: {
      discard: {
        moves: {
          discardCard: {
            move: discardCard,
            client: false,
          },
        },
      },
    },
  },

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
