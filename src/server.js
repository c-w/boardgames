import { Server } from 'boardgame.io/server';
import Game from './game';
import envalid from 'envalid';

const env = envalid.cleanEnv(process.env, {
  PORT: envalid.port(),
});

const server = Server({
  games: [
    Game
  ],
});

server.run(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
