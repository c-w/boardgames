import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import useInterval from '@use-hooks/interval';
import Loading from './Loading';
import config from './config';
import { useGame } from './hooks';

/**
 * @param {object} props
 * @param {string} props.gameName
 */
function CreateGame({ gameName }) {
  return (
    <Link to={`/${gameName}/new`} className="create-game">Create a new game</Link>
  );
}

/**
 * @param {object} props
 * @param {string} props.gameName
 */
export default function MatchList({ gameName }) {
  const [matches, setMatches] = useState(null);
  const { game } = useGame(gameName);

  useInterval(useCallback(async () => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });
    const data = await client.listMatches(gameName);
    setMatches(data.matches);
  }, [gameName, setMatches]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  if (matches == null || game == null) {
    return <Loading />;
  }

  const openMatches = matches.filter(match => match.players.some(player => player.name == null));

  if (openMatches.length === 0) {
    return (
      <div className="matches">
        There are currently no games waiting for players. <CreateGame gameName={game.name} />
      </div>
    );
  }

  return (
    <div className="matches">
      <CreateGame gameName={game.name} /> or join one of the games below:
      <ul>
        {openMatches.map(match => (
          <li key={match.matchID}>
            <Link to={`/${game.name}/join/${match.matchID}`}>
              Join game by {match.players.find(player => player.name)?.name || 'unknown'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
