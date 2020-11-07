import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LobbyClient } from 'boardgame.io/client';
import Form from '@rjsf/core';
import Loading from './Loading';
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

function schemaFor(game) {
  return {
    type: 'object',
    required: [
      ...GAME_DATA_SCHEMA.required,
      ...game.setupDataSchema.required,
    ],
    properties: {
      playerName: GAME_DATA_SCHEMA.properties.playerName,
      ...game.setupDataSchema.properties,
      unlisted: GAME_DATA_SCHEMA.properties.unlisted,
    },
  };
}

/**
 * @param {string} gameName
 * @returns {string}
 */
function formDataKeyFor(gameName) {
  return `${gameName}-formData`;
}

/**
 * @param {object} props
 * @param {string} props.gameName
 */
function CreateGame({ gameName }) {
  const [error, setError] = useState(null);
  const history = useHistory();
  const { game } = useGame(gameName);

  const formDataKey = formDataKeyFor(gameName);

  const onSubmit = async ({ formData }, event) => {
    event.preventDefault();
    localStorage.setItem(formDataKey, JSON.stringify(formData));

    let { playerName, unlisted, numPlayers, ...setupData } = formData;
    numPlayers = numPlayers || game.maxPlayers;

    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    try {
      const match = await client.createMatch(game.name, {
        numPlayers,
        setupData,
        unlisted,
      });

      const matchID = match.matchID;
      const playerID = getRandomInt(numPlayers);

      const join = await client.joinMatch(game.name, matchID, {
        playerID: `${playerID}`,
        playerName,
      });

      history.push(`/${game.name}/wait/${matchID}/${playerID}/${join.playerCredentials}`);
    } catch (ex) {
      setError('Unexpected error');
      console.error(error);
    }
  };

  if (game == null) {
    return <Loading />;
  }

  const schema = schemaFor(game);

  const formData = JSON.parse(localStorage.getItem(formDataKey));

  return (
    // @ts-ignore
    <Form schema={schema} onSubmit={onSubmit} formData={formData}>
      <input
        type="submit"
        value={error || 'Create game'}
        disabled={error != null}
      />
    </Form>
  );

}

/**
 * @param {object} props
 * @param {string} props.gameName
 * @param {string} props.matchID
 */
function JoinGame({ gameName, matchID }) {
  const [error, setError] = useState(null);
  const [match, setMatch] = useState(null);
  const history = useHistory();
  const { game } = useGame(gameName);

  const formDataKey = formDataKeyFor(gameName);

  useEffect(() => {
    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    client.getMatch(gameName, matchID).then(match => setMatch(match));
  }, [gameName, matchID]);

  const onSubmit = async ({ formData }, event) => {
    event.preventDefault();
    localStorage.setItem(formDataKey, JSON.stringify(formData));

    const client = new LobbyClient({ server: config.REACT_APP_SERVER_URL });

    const playerID = match.players.find(p => p.name == null)?.id;

    if (playerID == null) {
      setError('The game is already full');
      return;
    }

    try {
      const join = await client.joinMatch(gameName, matchID, {
        playerID: `${playerID}`,
        playerName: formData.playerName,
      });

      history.push(`/${game.name}/wait/${matchID}/${playerID}/${join.playerCredentials}`);
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

  if (game == null || match == null) {
    return <Loading />;
  }

  const schema = schemaFor(game);

  const uiSchema = Object.fromEntries(Object.keys(schema.properties).filter(key => key !== 'playerName').map(key => ([
    key,
    { 'ui:disabled': true },
  ])));

  const formData = {
    ...JSON.parse(localStorage.getItem(formDataKey)),
    ...match.setupData,
    unlisted: match.unlisted,
    numPlayers: match.players.length,
  };

  return (
    // @ts-ignore
    <Form schema={schema} onSubmit={onSubmit} formData={formData} uiSchema={uiSchema}>
      <input
        type="submit"
        value={error || 'Join game'}
        disabled={error != null}
      />
    </Form>
  );
}

/**
 * @param {object} props
 * @param {string} props.gameName
 * @param {string} props.matchID
 */
export default function Lobby(props) {
  return props.matchID == null
    ? <CreateGame {...props} />
    : <JoinGame {...props} />;
}
