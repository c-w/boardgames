import { FlatFile, Server } from 'boardgame.io/server';
import serve from 'koa-static';
import path from 'path';
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

server.app.use(serve(path.join(__dirname, '..', '..', 'build')));

server.run(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
