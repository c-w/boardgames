import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import { last, removeAt, sum } from './utils.js';

const SUITS = ['key', 'tower', 'moon'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const WINNING_SCORE = 16;
const HAND_SIZE = 13;
const PLAYER_1 = 0;
const PLAYER_2 = 1;

function dealCards(ctx) {
  const deck = ctx.random.Shuffle(
    SUITS.map(suit => RANKS.map(rank => ({ suit, rank }))).flat()
  );

  const trump = deck.pop();

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
    trump,
    players: {
      [PLAYER_1]: {
        hand: hand1,
      },
      [PLAYER_2]: {
        hand: hand2,
      },
    },
  };
}

function getPlayers(G, ctx) {
  const opponentID = Object.keys(G.players).find(id => id !== ctx.currentPlayer);
  const playerID = ctx.currentPlayer;

  const hand = [...G.players[playerID].hand];

  return {
    opponentID,
    playerID,
    hand,
  };
}

function getCard(G, ctx, i) {
  const { hand } = getPlayers(G, ctx);

  const card = i == null
    ? { ...G.stashed }
    : hand[i];

  const newHand = removeAt(hand, i);

  return {
    card,
    newHand,
  };
}

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

function checkGameOver(G, ctx) {
  const { playerID, opponentID } = getPlayers(G, ctx);

  const playerScores = G.scores[playerID];
  const opponentScores = G.scores[opponentID];

  const playerScore = sum(playerScores);
  const opponentScore = sum(opponentScores);

  if (playerScore < WINNING_SCORE && opponentScore < WINNING_SCORE) {
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

function discardCard(G, ctx, i) {
  const { playerID, hand } = getPlayers(G, ctx);

  G.players[playerID].hand = removeAt(hand, i);

  ctx.events.endStage();

  playCard(G, ctx);
}

export function isMoveInvalid(G, ctx, i, j) {
  if (i == null && G.stashed == null) {
    return 'played_no_card';
  }

  const { hand } = getPlayers(G, ctx);
  const { card, newHand } = getCard(G, ctx, i);

  if (card == null) {
    return 'played_unknown_card';
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
    if (card.suit !== G.played.suit && newHand.some(c => c.suit === G.played.suit)) {
      return 'must_follow_suit';
    }

    const highestRankInSuit = hand
      .filter(c => c.suit === G.played.suit)
      .map(c => c.rank)
      .reduce((max, rank) => max < rank ? rank : max, -1);

    if (G.played.rank === 11 && card.rank !== 1 && card.rank !== highestRankInSuit) {
      return 'must_follow_11';
    }
  }
}

function determineTrickWinner(G, ctx, i) {
  const { playerID, opponentID } = getPlayers(G, ctx);
  const { card } = getCard(G, ctx, i);

  const trumpSuit = G.trump.suit;

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

function playCard(G, ctx, i, j) {
  if (isMoveInvalid(G, ctx, i, j)) {
    return INVALID_MOVE;
  }

  const { playerID, opponentID, hand } = getPlayers(G, ctx);

  const { card, newHand } = getCard(G, ctx, i, j);

  if (card.rank === 3 && j != null) {
    const oldTrump = { ...G.trump };
    G.trump = { ...hand[j] };
    G.players[playerID].hand[j] = oldTrump;
  }

  if (card.rank === 5 && G.stashed == null) {
    newHand.push(G.secret.deck.pop());

    G.players[playerID].hand = newHand;
    G.stashed = card;

    ctx.events.setStage('discard');
    return;
  }

  if (G.played == null) {
    G.players[playerID].hand = newHand;
    G.played = card;
    ctx.events.endTurn();
    return;
  }

  const { winner, next } = determineTrickWinner(G, ctx, i);

  G.tricks.push({ winner, cards: [{ ...G.played }, { ...card }] });
  G.played = null;
  G.stashed = null;
  G.players[playerID].hand = newHand;

  if (newHand.length === 0) {
    for (const id of [playerID, opponentID]) {
      const tricks = G.tricks.filter(t => t.winner === id);
      const score = calculateScore(tricks);
      G.scores[id].push(score);
    }

    const newRound = dealCards(ctx);
    G.secret = newRound.secret;
    G.tricks = newRound.tricks;
    G.trump = newRound.trump;
    G.players = newRound.players;
    ctx.events.endTurn();
    return;
  }

  ctx.events.endTurn({ next });
}

export default {
  name: 'the-fox-in-the-forest',

  minPlayers: 2,
  maxPlayers: 2,

  setup: (ctx) => ({
    ...dealCards(ctx),
    played: null,
    stashed: null,
    scores: {
      [PLAYER_1]: [],
      [PLAYER_2]: [],
    },
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
};
