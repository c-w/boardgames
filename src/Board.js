import React from 'react';
import { sum } from './utils';

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
  const isOver = ctx.gameover != null;
  const isWinner = isOver && ctx.gameover.winner === playerID;
  const isActive = playerID === ctx.currentPlayer;
  const player = G.players[playerID];
  const tricks = G.tricks[playerID];

  return (
    <div style={{ backgroundColor: isOver && isWinner ? '#CCAC00' : isOver ? '#C0C0C0' : isActive ? '#C1FFC1' : '#E9967A' }}>
      <div>Player: {playerID}</div>
      <div>Score: {sum(G.scores[playerID])}</div>
      {!isOver && (
        <React.Fragment>
          <div>Trump: <Card {...G.trump} /></div>
          <div>Tricks: {tricks}</div>
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
        </React.Fragment>
      )}
    </div>
  );
}
