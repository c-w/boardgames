import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import Board from './Board';
import Game from './game';

export default Client({
  game: Game,
  board: Board,
  multiplayer: SocketIO({ server: process.env.REACT_APP_SERVER_URL }),
  debug: false,
});
