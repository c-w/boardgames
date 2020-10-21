import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import useInterval from '@use-hooks/interval';
import config from './config';
import { useGame } from './hooks';

export default function MatchList({ gameName }) {
  const [matches, setMatches] = useState(null);
  const game = useGame(gameName);

  useInterval(useCallback(async () => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });
    const data = await client.listMatches(gameName);
    setMatches(data.matches);
  }, [gameName, setMatches]), config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

  if (matches == null || game == null) {
    return null;
  }

  const openMatches = matches.filter(match => match.players.some(player => player.name == null));

  if (openMatches.length === 0) {
    return (
      <span>
        There are currently no games waiting for players. <Link to={`/${game.name}/new`}>Start your own game.</Link>
      </span>
    );
  }

  return (
    <React.Fragment>
      <Link to={`/${game.name}/new`}>Start your own game</Link> or join one of the games below.
      <ul>
        {openMatches.map(match => (
          <li key={match.matchID}>
            <Link to={`/${game.name}/join/${match.matchID}`}>
              Join game by {match.players.find(player => player.name)?.name || 'unknown'}
            </Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
