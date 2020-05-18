import React, { Suspense, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import loadBoard from './boards';
import config from './config';
import newHttpClient from './http';
import { useGame } from './hooks';
import { repeatedly } from '../shared/utils';

export default function WaitForPlayers(props) {
  const { gameName, gameID } = props;

  const game = useGame(gameName);
  const board = loadBoard(gameName);

  const [status, setStatus] = useState({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const http = newHttpClient(gameName);

    const refreshInterval = repeatedly(async () => {
      if (game == null) {
        return;
      }

      const response = await http.get(`/${gameID}`);

      const isReady = response.data.players.filter(p => p.name != null).length === game.minPlayers;

      if (isReady) {
        clearInterval(refreshInterval);
      }

      setStatus({ isLoading: false, isReady });
    }, config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

    return () => clearInterval(refreshInterval);
  }, [gameID, game, gameName]);

  const onCopy = () => {
    setCopied(true);
  };

  if (status.isLoading) {
    return null;
  }

  if (status.isReady) {
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

  const joinURL = `${window.location.href.split('#')[0]}#/${gameName}/join/${gameID}`;

  return (
    <label>
      Invite someone to join the game by sharing this URL:

      <CopyToClipboard
        text={joinURL}
        onCopy={onCopy}
      >
        <input
          readOnly
          value={joinURL}
          style={{ width: `${joinURL.length}ch` }}
        />
      </CopyToClipboard>
      {copied && (
        <div>
          <em>Copied to clipboard</em>
        </div>
      )}
    </label>
  );
}
