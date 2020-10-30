import React, { Suspense } from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import Loading from './Loading';
import config from './config';
import { useGame } from './hooks';

/**
 * @param {Object} props
 * @param {string} props.gameName
 */
export default function Play({ gameName, ...props }) {
  const { game, board } = useGame(gameName);

  if (game == null || board == null) {
    return <Loading />;
  }

  const GameClient = Client({
    game,
    board,
    multiplayer: SocketIO({ server: config.REACT_APP_SERVER_URL }),
    debug: false,
    loading: Loading,
  });

  return (
    <Suspense fallback={<Loading />}>
      <GameClient {...props} />
    </Suspense>
  );
}
