import { Server } from 'boardgame.io/server';
import config from './config/server';
import Game from './game';

const server = Server({
  games: [
    Game
  ],
});

server.run(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
