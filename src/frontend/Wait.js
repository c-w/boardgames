import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useInterval from '@use-hooks/interval';
import config from './config';
import newHttpClient from './http';
import { useGame } from './hooks';

export default function Wait({ gameName, gameID, playerID, credentials }) {
  const game = useGame(gameName);

  const [status, setStatus] = useState({});
  const [copied, setCopied] = useState(false);

  useInterval(useCallback(async () => {
    if (game == null) {
      return;
    }

    const http = newHttpClient(game.name);

    const response = await http.get(`/${gameID}`);

    const isReady = response.data.players.filter(p => p.name != null).length === game.minPlayers;

    setStatus({ isLoading: false, isReady });
  }, [game, gameID, setStatus]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  const onCopy = () => {
    setCopied(true);
  };

  if (status.isLoading) {
    return null;
  }

  if (status.isReady) {
    return (
      <Redirect to={`/${game.name}/play/${gameID}/${playerID}/${credentials}`} />
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
