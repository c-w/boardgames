import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import config from './config';

export default function GameList() {
  const [games, setGames] = useState(null);

  useEffect(() => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });
    client.listGames().then(data => setGames(data));
  }, [setGames]);

  if (games == null) {
    return null;
  }

  if (games.length === 1) {
    return (
      <Redirect to={`/${games[0]}/join`} />
    );
  }

  return (
    <ul>
      {games.map(game => (
        <li key={game}>
          <Link to={`/${game}/join`}>
            {game}
          </Link>
        </li>
      ))}
    </ul>
  );
}
