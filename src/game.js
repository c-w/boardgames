import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import { last, sum } from './utils.js';

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
    tricks: {
      [PLAYER_1]: 0,
      [PLAYER_2]: 0,
    },
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

  const opponent = G.players[opponentID];
  const player = G.players[playerID];

  return {
    opponentID,
    opponent,
    playerID,
    player,
  };
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

function playCard(G, ctx, i) {
  const { playerID, opponentID, player } = getPlayers(G, ctx);

  const card = player.hand[i];
  const hand = player.hand.filter((_, j) => j !== i);

  if (G.played == null) {
    player.hand = hand;
    G.played = card;
    ctx.events.endTurn();
    return;
  }

  const highestRankInSuit = player.hand
    .filter(c => c.suit === G.played.suit)
    .map(c => c.rank)
    .reduce((max, rank) => max < rank ? rank : max, -1);

  let winnerId;

  if (card.suit !== G.played.suit && hand.some(c => c.suit === G.played.suit)) {
    return INVALID_MOVE;
  } else if (G.played.rank === 11 && card.rank !== 1 && card.rank !== highestRankInSuit) {
    return INVALID_MOVE;
  } else if (card.suit === G.trump.suit && G.played.suit !== G.trump.suit) {
    winnerId = playerID;
  } else if (card.suit !== G.trump.suit && G.played.suit === G.trump.suit) {
    winnerId = opponentID;
  } else if (card.suit === G.played.suit) {
    winnerId = card.rank > G.played.rank ? playerID : opponentID;
  } else if (card.suit !== G.played.suit) {
    winnerId = opponentID;
  } else {
    throw new Error(`Unhandled state card=${card.rank}@${card.suit} played=${G.played.rank}@${G.played.suit}`);
  }

  let next;

  if (G.played.rank === 1 && winnerId !== opponentID) {
    next = opponentID;
  } else if (card.rank === 1 && winnerId !== playerID) {
    next = playerID;
  } else {
    next = winnerId;
  }

  player.hand = hand;
  G.tricks[winnerId]++;
  G.played = null;

  if (player.hand.length === 0) {
    [playerID, opponentID].forEach(id => {
      const tricks = G.tricks[id];

      if (tricks <= 3) {
        G.scores[id].push(6);
      } else if (tricks === 4) {
        G.scores[id].push(1);
      } else if (tricks === 5) {
        G.scores[id].push(2);
      } else if (tricks === 6) {
        G.scores[id].push(3);
      } else if (tricks >= 7 && tricks <= 9) {
        G.scores[id].push(6);
      } else {
        G.scores[id].push(0);
      }
    });

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

  endIf: checkGameOver,

  playerView: PlayerView.STRIP_SECRETS,

  events: {
    endTurn: false,
    endGame: false,
  },
};
