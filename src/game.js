import { INVALID_MOVE } from 'boardgame.io/core';

const SUITS = ['key', 'tower', 'moon'];
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
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
    deck,
    trump,
    players: {
      [PLAYER_1]: {
        hand: hand1,
        tricks: 0,
      },
      [PLAYER_2]: {
        hand: hand2,
        tricks: 0,
      },
    },
  };
}

function playCard(G, ctx, i) {
  const opponentID = Object.keys(G.players).find(id => id !== ctx.currentPlayer);
  const playerID = ctx.currentPlayer;
  const player = G.players[playerID];

  const card = player.hand[i];
  const hand = player.hand.filter((_, j) => j !== i);

  if (G.played == null) {
    player.hand = hand;
    G.played = card;
    ctx.events.endTurn();
    return;
  }

  let winnerId;

  if (card.suit !== G.played.suit && hand.some(c => c.suit === G.played.suit)) {
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

  player.hand = hand;
  G.players[winnerId].tricks++;
  G.played = null;

  if (player.hand.length === 0) {
    [playerID, opponentID].forEach(id => {
      const { tricks } = G.players[id];

      if (tricks <= 3) {
        G.scores[id] += 6;
      } else if (tricks === 4) {
        G.scores[id] += 1;
      } else if (tricks === 5) {
        G.scores[id] += 2;
      } else if (tricks === 6) {
        G.scores[id] += 3;
      } else if (tricks >= 7 && tricks <= 9) {
        G.scores[id] += 6;
      }
    });

    const newRound = dealCards(ctx);
    G.deck = newRound.deck;
    G.trump = newRound.trump;
    G.players = newRound.players;
    ctx.events.endTurn();
    return;
  }

  ctx.events.endTurn({ next: winnerId });
}

export default {
  name: 'the-fox-in-the-forest',

  minPlayers: 2,
  maxPlayers: 2,

  setup: (ctx) => ({
    ...dealCards(ctx),
    played: null,
    scores: {
      [PLAYER_1]: 0,
      [PLAYER_2]: 0,
    },
  }),

  moves: {
    playCard,
  },

  events: {
    endTurn: false,
    endGame: false,
  },
};
