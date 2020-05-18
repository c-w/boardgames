import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import newHttpClient from './http';
import { useGame } from './lazyload';
import { getRandomInt } from '../shared/utils';

export default withRouter(({ history, gameName, gameID }) => {
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  const [longGame, setLongGame] = useState(localStorage.getItem('longGame') !== 'false'); // TODO: make this dynamic
  const [unlisted, setUnlisted] = useState(localStorage.getItem('unlisted') !== 'false');
  const [error, setError] = useState('');
  const game = useGame(gameName);

  const http = newHttpClient(gameName);
  const isNewGame = gameID == null;

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

  const onChangeUnlisted = (event) => {
    const { checked } = event.target;
    setUnlisted(checked);
    localStorage.setItem('unlisted', checked);
  };

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      let playerID;

      if (isNewGame) {
        const response = await http.post('/create', {
          numPlayers: game.maxPlayers,
          setupData: {
            longGame,
          },
          unlisted,
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

      history.push(`/${game.name}/play/${gameID}/${playerID}/${response.data.playerCredentials}`);
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

  if (game == null) {
    return null;
  }

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
        value={error || (isNewGame ? 'Create game' : 'Join game')}
        disabled={error}
      />
      {isNewGame && (
        <div>
          <label>
            <input
              type="checkbox"
              onChange={onChangeLongGame}
              checked={longGame}
            />
            Long game
          </label>
          <label>
            <input
              type="checkbox"
              onChange={onChangeUnlisted}
              checked={unlisted}
            />
            Unlisted
          </label>
        </div>
      )}
    </form>
  );
});
