import React from 'react';

function Card({ rank, suit, onClick }) {
  if (!rank || !suit) {
    return null;
  }

  if (!onClick) {
    return (
      <span>{rank} of {suit}</span>
    );
  }

  return (
    <button onClick={onClick}>
      {rank} of {suit}
    </button>
  );
}

export default function Board({ G, ctx, playerID, moves }) {
  const isActive = playerID === ctx.currentPlayer;
  const player = G.players[playerID];

  return (
    <div style={{ backgroundColor: isActive ? '#C1FFC1' : '#E9967A' }}>
      <div>Player: {playerID}</div>
      <div>Score: {G.scores[playerID]}</div>
      <div>Trump: <Card {...G.trump} /></div>
      <div>Tricks: {player.tricks}</div>
      <div>Current: <Card {...G.played} /></div>
      <div>Hand:
        <ol>
          {player.hand.map((card, i) =>
            <li key={`${card.rank}-${card.suit}`}>
              <Card {...card} onClick={() => moves.playCard(i) } />
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}
