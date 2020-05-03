import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from './config';
import http from './http';
import game from '../shared/game';
import { repeatedly } from '../shared/utils';

export default function RoomList() {
  const [rooms, setRooms] = useState();

  useEffect(() => {
    const refreshInterval = repeatedly(async () => {
      const response = await http.get('/');
      setRooms(response.data.rooms);
    }, config.REACT_APP_WAITING_FOR_PLAYER_REFRESH_MS);

    return () => clearInterval(refreshInterval);
  }, [setRooms]);


  if (rooms == null) {
    return null;
  }

  const openRooms = rooms.filter(room => room.players.filter(player => player.name).length < game.maxPlayers);

  if (openRooms.length === 0) {
    return (
      <span>
        There are currently no games waiting for players. <Link to="/new">Start your own game.</Link>
      </span>
    );
  }

  return (
    <React.Fragment>
      <Link to="/new">Start your own game</Link> or join one of the games below.
      <ul>
        {openRooms.map(room => (
          <li key={room.gameID}>
            <Link to={`/join/${room.gameID}`}>
              Join game by {room.players.find(player => player.name).name}
            </Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
