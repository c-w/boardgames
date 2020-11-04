import React, { useCallback, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LobbyClient } from 'boardgame.io/client';
import useInterval from '@use-hooks/interval';
import Loading from './Loading';
import config from './config';
import { useGame } from './hooks';
import './Wait.scoped.css';

/**
 * @param {object} props
 * @param {string} props.gameName
 * @param {string} props.matchID
 * @param {string} props.playerID
 * @param {string} props.credentials
 */
export default function Wait({ gameName, matchID, playerID, credentials }) {
  const { game } = useGame(gameName);

  const [status, setStatus] = useState({ isReady: false, isLoading: true });
  const [copied, setCopied] = useState(false);

  useInterval(useCallback(async () => {
    if (game == null) {
      return;
    }

    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    const data = await client.getMatch(game.name, matchID);

    const isReady = data.players.every(p => p.name != null);

    setStatus({ isLoading: false, isReady });
  }, [game, matchID, setStatus]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  const onCopy = () => {
    setCopied(true);
  };

  if (status.isLoading) {
    return <Loading />;
  }

  if (status.isReady) {
    return (
      <Redirect to={`/${game.name}/play/${matchID}/${playerID}/${credentials}`} />
    );
  }

  const joinURL = `${window.location.href.split('#')[0]}#/${gameName}/join/${matchID}`;

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
