import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import Form from '@rjsf/core';
import config from './config';
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

/**
 * @param {Object} props
 * @param {string} props.gameName
 * @param {string} props.matchID
 */
export default function Lobby({ gameName, matchID }) {
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const game = useGame(gameName);

  const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });
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
        const data = await client.createMatch(game.name, {
          numPlayers: game.maxPlayers,
          setupData,
          unlisted,
        });

        matchID = data.matchID;
        playerID = getRandomInt(game.maxPlayers);
      } else {
        const data = await client.getMatch(game.name, matchID);

        playerID = data.players.find(p => p.name == null)?.id;

        if (playerID == null) {
          setError('The game is already full');
          return;
        }
      }

      const data = await client.joinMatch(game.name, matchID, {
        playerID: `${playerID}`,
        playerName,
      });

      history.push(`/${game.name}/${isNewMatch ? 'wait' : 'play'}/${matchID}/${playerID}/${data.playerCredentials}`);
    } catch (ex) {
      if (ex.message === 'HTTP status 409') {
        setError('The game is already full');
      } else if (ex.message === 'HTTP status 404') {
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
    // @ts-ignore
    <Form schema={schema} onSubmit={onSubmit} formData={formData}>
      <input
        type="submit"
        value={error || (isNewMatch ? 'Create game' : 'Join game')}
        disabled={error != null}
      />
    </Form>
  );
}
