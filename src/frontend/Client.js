import React, { useEffect, useState } from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import Board from './Board';
import config from './config';
import http from './http';
import game from '../shared/game';
import { repeatedly } from '../shared/utils';

const GameClient = Client({
  game,
  board: Board,
  multiplayer: SocketIO({ server: config.REACT_APP_SERVER_URL }),
  debug: false,
});

export default function WaitForPlayers(props) {
  const { gameID } = props;

  const [status, setStatus] = useState({});

  useEffect(() => {
    const refreshInterval = repeatedly(async () => {
      const response = await http.get(`/${gameID}`);

      const isReady = response.data.players.filter(p => p.name != null).length === game.minPlayers;

      if (isReady) {
        clearInterval(refreshInterval);
      }

      setStatus({ isLoading: false, isReady });
    }, config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

    return () => clearInterval(refreshInterval);
  }, [gameID]);

  if (status.isLoading) {
    return null;
  }

  if (status.isReady) {
    return <GameClient {...props} />;
  }

  const joinURL = `${window.location.href.split('#')[0]}#/join/${gameID}`;

  return (
    <label>
      Invite someone to join the game by sharing this URL:
      <input
        readOnly
        value={joinURL}
        style={{ width: `${joinURL.length}ch` }}
      />
    </label>
  );
}
