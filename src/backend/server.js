import { FlatFile, Server } from 'boardgame.io/server';
import config from './config';
import Game from '../shared/game';

const server = Server({
  games: [
    Game
  ],

  db: new FlatFile({
    dir: config.STATE_DIR,
  }),
});

server.run(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
