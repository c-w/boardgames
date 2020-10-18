import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { FlatFile, Server, SocketIO } from 'boardgame.io/server';
import { AzureStorage } from 'bgio-azure-storage';
import fs from 'fs';
import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import config from './config';
import fitf from '../shared/games/fitf';
import sgp from '../shared/games/sgp';

let db;

if (config.AZURE_STORAGE_ACCOUNT) {
  db = new AzureStorage({
    client: new BlobServiceClient(
      `https://${config.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
      new DefaultAzureCredential(),
    ),
    container: config.AZURE_STORAGE_CONTAINER,
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
  } : undefined,
  socketOpts: {
    perMessageDeflate: config.SOCKET_PER_MESSAGE_DEFLATE,
  },
});

const server = Server({
  games: [
    fitf,
    sgp,
  ],

  db,

  transport,
});

server.app.use(serve(path.join(__dirname, '..', '..', 'build')));

if (config.HTTPS && config.SECONDARY_PORT) {
  const httpServer = new Koa();
  httpServer.use(ctx => {
    ctx.status = 302;
    ctx.redirect(`https://${ctx.request.hostname}:${config.PORT}${ctx.request.path}`);
  });
  new Promise(() => {
    httpServer.listen(config.SECONDARY_PORT);
  });
}

server.run(config.PORT);
