import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import game from './game';

const http = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/games/${game.name}`,
});

export default withRouter(({ history, gameID }) => {
  const [playerName, setPlayerName] = useState('');

  const onChange = (event) => {
    setPlayerName(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let playerID = 1;

    if (gameID == null) {
      const response = await http.post('/create', {
        numPlayers: game.numPlayers,
      });

      gameID = response.data.gameID;
      playerID = 0;
    }

    const response = await http.post(`/${gameID}/join`, {
      playerID,
      playerName,
    });

    history.push(`/play/${gameID}/${playerID}/${response.data.playerCredentials}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Enter your name:
        <input onChange={onChange} />
      </label>
      <input type="submit" value={gameID == null ? 'Create game' : 'Join game'} />
    </form>
  );
});
