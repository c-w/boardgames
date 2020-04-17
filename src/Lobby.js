import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import http from './http';
import game from './game';

export default withRouter(({ history, gameID }) => {
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName'));

  const onChange = (event) => {
    const { value } = event.target;
    setPlayerName(value);
    localStorage.setItem('playerName', value);
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
        <input onChange={onChange} value={playerName} />
      </label>
      <input type="submit" value={gameID == null ? 'Create game' : 'Join game'} />
    </form>
  );
});
