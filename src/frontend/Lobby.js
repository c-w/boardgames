import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import http from './http';
import game from '../shared/game';

export default withRouter(({ history, gameID }) => {
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [error, setError] = useState('');

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

    let response;
    try {
      response = await http.post(`/${gameID}/join`, {
        playerID,
        playerName,
      });
    } catch (ex) {
      if (ex.response?.status === 409) {
        setError('The game is already full');
        return;
      }
      throw ex;
    }

    history.push(`/play/${gameID}/${playerID}/${response.data.playerCredentials}`);
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Enter your name:
        <input
          onChange={onChange}
          value={playerName}
          required
          minLength="1"
        />
      </label>
      <input
        type="submit"
        value={error || (gameID == null ? 'Create game' : 'Join game')}
        disabled={error}
      />
    </form>
  );
});
