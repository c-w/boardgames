import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Form from '@rjsf/core';
import newHttpClient from './http';
import { useGame } from './hooks';
import { getRandomInt } from '../shared/utils';

const GAME_DATA_SCHEMA = {
  required: [
    'playerName',
  ],
  properties: {
    playerName: {
      title: 'Enter your name',
      type: 'string',
      minLength: 1,
    },
    unlisted: {
      title: 'Unlisted',
      type: 'boolean',
    },
  },
};

export default withRouter(({ history, gameName, matchID }) => {
  const [schema, setSchema] = useState();
  const [error, setError] = useState('');
  const game = useGame(gameName);

  const http = newHttpClient(gameName);
  const isNewMatch = matchID == null;
  const formDataKey = `${gameName}-formData`;
  const formData = JSON.parse(localStorage.getItem(formDataKey));

  useEffect(() => {
    if (game == null) {
      return;
    }

    if (!isNewMatch) {
      setSchema({
        type: 'object',
        required: [
          'playerName',
        ],
        properties: {
          playerName: GAME_DATA_SCHEMA.properties.playerName,
        },
      });
      return;
    }

    setSchema({
      type: 'object',
      required: [
        ...GAME_DATA_SCHEMA.required,
        ...game.setupDataSchema.required,
      ],
      properties: {
        ...GAME_DATA_SCHEMA.properties,
        ...game.setupDataSchema.properties,
      },
    });
  }, [game, isNewMatch]);

  const onSubmit = async ({ formData }, event) => {
    localStorage.setItem(formDataKey, JSON.stringify(formData));

    const { playerName, unlisted, ...setupData } = formData;

    try {
      event.preventDefault();

      let playerID;

      if (isNewMatch) {
        const response = await http.post('/create', {
          numPlayers: game.maxPlayers,
          setupData,
          unlisted,
        });

        matchID = response.data.matchID;
        playerID = getRandomInt(game.maxPlayers);
      } else {
        const response = await http.get(`/${matchID}`);

        playerID = response.data.players.find(p => p.name == null)?.id;

        if (playerID == null) {
          setError('The game is already full');
          return;
        }
      }

      const response = await http.post(`/${matchID}/join`, {
        playerID,
        playerName,
      });

      history.push(`/${game.name}/${isNewMatch ? 'wait' : 'play'}/${matchID}/${playerID}/${response.data.playerCredentials}`);
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

  if (game == null || schema == null) {
    return null;
  }

  return (
    <Form schema={schema} onSubmit={onSubmit} formData={formData}>
      <input
        type="submit"
        value={error || (isNewMatch ? 'Create game' : 'Join game')}
        disabled={error}
      />
    </Form>
  );
});
