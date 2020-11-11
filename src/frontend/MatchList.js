import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import useInterval from '@use-hooks/interval';
import Loading from './Loading';
import config from './config';

/**
 * @typedef {import('boardgame.io').Game} Game
 */

function CreateGame() {
  return (
    <Link to="/new" className="create-game">Create a new game</Link>
  );
}

/**
 * @param {object} props
 * @param {Game} props.game
 */
export default function MatchList({ game }) {
  const [matches, setMatches] = useState(null);

  useInterval(useCallback(async () => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });
    const data = await client.listMatches(game.name);
    setMatches(data.matches);
  }, [game, setMatches]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  if (matches == null) {
    return <Loading />;
  }

  const openMatches = matches.filter(match => match.players.some(player => player.name == null));

  if (openMatches.length === 0) {
    return (
      <div className="matches">
        There are currently no games waiting for players. <CreateGame />
      </div>
    );
  }

  return (
    <div className="matches">
      <CreateGame /> or join one of the games below:
      <ul>
        {openMatches.map(match => (
          <li key={match.matchID}>
            <Link to={`/join/${match.matchID}`}>
              Join game by {match.players.find(player => player.name)?.name || 'unknown'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
