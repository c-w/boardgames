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
  const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);
  const history = useHistory();
  const game = useGame(gameName);

  const isNewMatch = matchID == null;
  const formDataKey = `${gameName}-formData`;

  useEffect(() => {
    if (matchID != null) {
      const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

      client.getMatch(gameName, matchID).then(data => setMatch(data));
    }
  }, [gameName, matchID, setMatch]);

  const onSubmit = async ({ formData }, event) => {
    localStorage.setItem(formDataKey, JSON.stringify(formData));

    let { playerName, unlisted, numPlayers, ...setupData } = formData;
    numPlayers = numPlayers || game.maxPlayers;

    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    try {
      event.preventDefault();

      let playerID;

      if (isNewMatch) {
        const data = await client.createMatch(game.name, {
          numPlayers,
          setupData,
          unlisted,
        });

        matchID = data.matchID;
        playerID = getRandomInt(numPlayers);
      } else {
        playerID = match.players.find(p => p.name == null)?.id;

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

  if (game == null || (!isNewMatch && match == null)) {
    return null;
  }

  const schema = {
    type: 'object',
    required: [
      ...GAME_DATA_SCHEMA.required,
      ...game.setupDataSchema.required,
    ],
    properties: {
      ...GAME_DATA_SCHEMA.properties,
      ...game.setupDataSchema.properties,
    },
  };

  let uiSchema = undefined;

  let formData = JSON.parse(localStorage.getItem(formDataKey));

  if (!isNewMatch) {
    formData = { ...formData, ...match.setupData, unlisted: match.unlisted };

    uiSchema = Object.fromEntries(Object.keys(schema.properties).filter(key => key !== 'playerName').map(key => ([
      key,
      { 'ui:disabled': true },
    ])));
  }

  return (
    // @ts-ignore
    <Form schema={schema} onSubmit={onSubmit} formData={formData} uiSchema={uiSchema}>
      <input
        type="submit"
        value={error || (isNewMatch ? 'Create game' : 'Join game')}
        disabled={error != null}
      />
    </Form>
  );
}
