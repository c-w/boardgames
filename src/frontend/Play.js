import React, { Suspense } from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import config from './config';
import { useGame } from './hooks';

/**
 * @param {Object} props
 * @param {string} props.gameName
 */
export default function Play({ gameName, ...props }) {
  const { game, board } = useGame(gameName);

  if (game == null || board == null) {
    return null;
  }

  const GameClient = Client({
    game,
    board,
    multiplayer: SocketIO({ server: config.REACT_APP_SERVER_URL }),
    debug: false,
  });

  return (
    <Suspense fallback={null}>
      <GameClient {...props} />
    </Suspense>
  );
}
