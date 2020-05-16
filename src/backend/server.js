import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { FlatFile, Server, SocketIO } from 'boardgame.io/server';
import { AzureStorage } from 'bgio-azure-storage';
import fs from 'fs';
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import config from './config';
import Game from '../shared/game';

let db;

if (config.AZURE_STORAGE_ACCOUNT) {
  db = new AzureStorage({
    client: new BlobServiceClient(
      `https://${config.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
      new DefaultAzureCredential(),
    ),
    container: 'fitf',
  });
} else {
  db = new FlatFile({
    dir: config.STATE_DIR,
    ttl: config.STATE_TTL,
  });
}

const transport = new SocketIO({
  auth: true,
  https: config.HTTPS ? {
    cert: fs.readFileSync(config.SSL_CRT_FILE),
    key: fs.readFileSync(config.SSL_KEY_FILE),
  } : null,
});

const server = Server({
  games: [
    Game
  ],

  db,

  transport,
});

server.app.use(serve(path.join(__dirname, '..', '..', 'build')));

if (config.HTTPS && config.SECONDARY_PORT) {
  const httpServer = new Koa();
  httpServer.use(ctx => {
    ctx.status = 302;
    ctx.redirect(`https://${ctx.request.hostname}:${config.SERVER_PORT}${ctx.request.path}`);
  });
  new Promise(() => {
    httpServer.listen(config.SECONDARY_PORT);
  });
}

server.run(config.SERVER_PORT);
