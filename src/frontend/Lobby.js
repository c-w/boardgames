import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import http from './http';
import game from '../shared/game';
import { getRandomInt } from '../shared/utils';

export default withRouter(({ history, gameID }) => {
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [longGame, setLongGame] = useState(localStorage.getItem('longGame') !== 'false');
  const [error, setError] = useState('');

  const onChangePlayerName = (event) => {
    const { value } = event.target;
    setPlayerName(value);
    localStorage.setItem('playerName', value);
  };

  const onChangeLongGame = (event) => {
    const { checked } = event.target;
    setLongGame(checked);
    localStorage.setItem('longGame', checked);
  };

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      let playerID;

      if (gameID == null) {
        const response = await http.post('/create', {
          numPlayers: game.maxPlayers,
          setupData: {
            longGame,
          },
        });

        gameID = response.data.gameID;
        playerID = getRandomInt(game.maxPlayers);
      } else {
        const response = await http.get(`/${gameID}`);

        playerID = response.data.players.find(p => p.name == null)?.id;

        if (playerID == null) {
          setError('The game is already full');
          return;
        }
      }

      const response = await http.post(`/${gameID}/join`, {
        playerID,
        playerName,
      });

      history.push(`/play/${gameID}/${playerID}/${response.data.playerCredentials}`);
    } catch (ex) {
      if (ex.response?.status === 409) {
        setError('The game is already full');
      } else if (ex.response?.status === 404) {
        setError('The game no longer exists');
      } else {
        setError('Unexpected error');
        console.error(error);
      }
    }
  };

  const isJoining = gameID != null;

  return (
    <form onSubmit={onSubmit}>
      <label>
        Enter your name:
        <input
          onChange={onChangePlayerName}
          value={playerName}
          required
          minLength="1"
        />
      </label>
      <input
        type="submit"
        value={error || (isJoining ? 'Join game' : 'Create game')}
        disabled={error}
      />
      {!isJoining && (
        <div>
          <label>
            <input
              type="checkbox"
              onChange={onChangeLongGame}
              checked={longGame}
            />
            Long game
          </label>
        </div>
      )}
    </form>
  );
});
