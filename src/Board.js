import React, { useState } from 'react';
import { last, sum } from './utils';

function Card({ rank, suit, onClick, enabled }) {
  if (!rank || !suit) {
    return null;
  }

  const card = (
    <span className={suit}>
      {rank} of {suit}
    </span>
  );

  if (!onClick) {
    return card;
  }

  return (
    <label>
      <input
        type="checkbox"
        onClick={onClick}
        disabled={!enabled}
      />
      &nbsp;{card}
    </label>
  );
}

export default function Board({ G, ctx, playerID, moves }) {
  const [checkboxes, setCheckboxes] = useState({});

  const chosen = Object.entries(checkboxes)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .map(i => Number(i));

  const playCard = (event) => {
    event.preventDefault();
    moves.playCard(...chosen);
    setCheckboxes({});
  };

  const discardCard = (event) => {
    event.preventDefault();
    moves.discardCard(...chosen);
    setCheckboxes({});
  };

  const onClick = (i) => (even) => {
    setCheckboxes({ ...checkboxes, [i]: even.target.checked });
  };

  const isOver = ctx.gameover != null;
  const isWinner = isOver && ctx.gameover.winner === playerID;
  const isActive = playerID === ctx.currentPlayer;
  const isDiscard = ctx.activePlayers && ctx.activePlayers[playerID] === 'discard';
  const player = G.players[playerID];
  const tricksWon = G.tricks.filter(t => t.winner === playerID).length;
  const tricksLost = G.tricks.filter(t => t.winner !== playerID).length;
  const lastTrick = G.tricks.length >= 1 ? last(G.tricks) : null;

  const hand = player.hand.map((card, i) => ({ card, i })).sort((a, b) => {
    return a.card.suit === b.card.suit
      ? a.card.rank - b.card.rank
      : a.card.suit.localeCompare(b.card.suit);
  });

  if (isOver) {
    return isWinner ? 'You won' : 'You lost';
  }

  return (
    <form onSubmit={isDiscard ? discardCard : playCard}>
      <fieldset disabled={!isActive}>
        <legend>Stats</legend>
        <div>
          Your score: {sum(G.scores[playerID])}
        </div>
        <div>
          Your tricks: {tricksWon}
        </div>
        <div>
          Opponent tricks: {tricksLost}
        </div>
        {lastTrick && (
          <div>
            Last trick:&nbsp;
            <Card {...lastTrick.cards[0]} /> vs <Card {...lastTrick.cards[1]} />&nbsp;
            (you {lastTrick.winner === playerID ? 'won' : 'lost'})
          </div>
        )}
      </fieldset>
      <fieldset disabled={!isActive}>
        <legend>This trick</legend>
        <div>
          Trump:&nbsp;
          <Card {...G.trump} />
        </div>
        {G.played && (
          <div>
            {isActive ? 'Opponent played' : 'You played'}:&nbsp;
            <Card {...G.played} />
          </div>
        )}
        <em>{isActive ? 'Your move!' : 'Waiting for opponent...'}</em>
      </fieldset>
      <fieldset disabled={!isActive}>
        <legend>Your hand</legend>
        <ol>
          {hand.map(({ card, i }) =>
            <li key={`${card.rank}-${card.suit}`}>
              <Card
                {...card}
                onClick={onClick(i)}
                enabled={
                  chosen.length === 0 ||
                  chosen.includes(i) ||
                  (!isDiscard && chosen.length === 1 && player.hand[chosen[0]].rank === 3)
                }
              />
            </li>
          )}
        </ol>
      </fieldset>
      <input
        type="submit"
        disabled={!isActive || chosen.length === 0}
        value={isDiscard ? 'Discard card' : 'Play card'}
      />
    </form>
  );
}
