import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import Loading from './Loading';
import config from './config';

/**
 * @typedef {import('boardgame.io').Game} Game
 * @typedef {import('boardgame.io/react').BoardProps} BoardProps
 * @typedef {import('react').ComponentType<BoardProps>} BoardComponent
 */

/**
 * @param {object} props
 * @param {Game} props.game
 * @param {BoardComponent} props.board
 */
export default function Play({ game, board, ...props }) {
  const GameClient = Client({
    game,
    board,
    multiplayer: SocketIO({ server: config.REACT_APP_SERVER_URL }),
    debug: false,
    loading: Loading,
  });

  return (
    <GameClient {...props} />
  );
}
