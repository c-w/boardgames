import React from 'react';

export default function Board({ ctx, playerID }) {
  const isActive = playerID === ctx.currentPlayer;

  return (
    <div style={{ backgroundColor: isActive ? '#C1FFC1' : '#E9967A' }}>
      <div>Player {playerID}</div>
    </div>
  );
}
