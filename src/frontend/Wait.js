import React, { useCallback, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { LobbyClient } from 'boardgame.io/client';
import useInterval from '@use-hooks/interval';
import Loading from './Loading';
import config from './config';
import './Wait.scoped.scss';

/**
 * @typedef {import('react').FocusEvent<HTMLTextAreaElement>} TextAreaFocusEvent
 * @typedef {import('boardgame.io').Game} Game
 */

/**
 * @param {object} props
 * @param {Game} props.game
 * @param {string} props.matchID
 * @param {string} props.playerID
 * @param {string} props.credentials
 */
export default function Wait({ game, matchID, playerID, credentials }) {
  const [status, setStatus] = useState({ isReady: false, isLoading: true });
  const [copied, setCopied] = useState(false);
  const history = useHistory();

  useInterval(useCallback(async () => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    const data = await client.getMatch(game.name, matchID);

    const isReady = data.players.every(p => p.name != null);

    setStatus({ isLoading: false, isReady });
  }, [game, matchID, setStatus]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  const selectContent = useCallback((/** @type {TextAreaFocusEvent} */ event) => {
    event.target.select();
  }, []);

  const onCopy = useCallback(() => {
    setCopied(true);
  }, [setCopied]);

  if (status.isLoading) {
    return <Loading />;
  }

  if (status.isReady) {
    return (
      <Redirect to={`/play/${matchID}/${playerID}/${credentials}`} />
    );
  }

  const joinURL = history.createHref({ pathname: `/join/${matchID}` });

  return (
    <div className="wait">
      <label>
        Invite someone to join the game by sharing this URL:

        <CopyToClipboard
          text={joinURL}
          onCopy={onCopy}
        >
          <div className="url">
            <textarea
              readOnly
              value={joinURL}
              onFocus={selectContent}
            />
          </div>
        </CopyToClipboard>
        {copied && (
          <div className="callout">
            <em>Copied to clipboard</em>
          </div>
        )}
      </label>
    </div>
  );
}
