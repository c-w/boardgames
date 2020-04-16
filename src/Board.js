import React, { useState } from 'react';
import { sum } from './utils';

function Card({ rank, suit, onClick, enabled }) {
  if (!rank || !suit) {
    return null;
  }

  if (!onClick) {
    return (
      <span>{rank} of {suit}</span>
    );
  }

  return (
    <label>
      <input
        type="checkbox"
        onClick={onClick}
        disabled={!enabled}
      />
      {rank} of {suit}
    </label>
  );
}

export default function Board({ G, ctx, playerID, moves }) {
  const [checkboxes, setCheckboxes] = useState({});

  const chosen = Object.entries(checkboxes)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .map(i => Number(i));

  const playCard = () => {
    moves.playCard(...chosen);
    setCheckboxes({});
  };

  const onClick = (i) => (even) => {
    setCheckboxes({ ...checkboxes, [i]: even.target.checked });
  };

  const isOver = ctx.gameover != null;
  const isWinner = isOver && ctx.gameover.winner === playerID;
  const isActive = playerID === ctx.currentPlayer;
  const player = G.players[playerID];
  const tricks = G.tricks[playerID].length;

  const hand = player.hand.map((card, i) => ({ card, i })).sort((a, b) => {
    return a.card.suit === b.card.suit
      ? a.card.rank - b.card.rank
      : a.card.suit.localeCompare(b.card.suit);
  });

  return (
    <div style={{ backgroundColor: isOver && isWinner ? '#CCAC00' : isOver ? '#C0C0C0' : null }}>
      <div>Player: {playerID}</div>
      <div>Score: {sum(G.scores[playerID])}</div>
      {!isOver && (
        <React.Fragment>
          <div>Trump: <Card {...G.trump} /></div>
          <div>Tricks: {tricks}</div>
          <div>Current: <Card {...G.played} /></div>
          <div>Hand:
            <ol>
              {hand.map(({ card, i }) =>
                <li key={`${card.rank}-${card.suit}`}>
                  <Card
                    {...card}
                    onClick={onClick(i)}
                    enabled={
                      chosen.length === 0 ||
                      chosen.includes(i) ||
                      (chosen.length === 1 && player.hand[chosen[0]].rank === 3)
                    }
                  />
                </li>
              )}
            </ol>
          </div>
          <button
            onClick={playCard}
            disabled={!isActive}
          >
            Play card
          </button>
        </React.Fragment>
      )}
    </div>
  );
}
