import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { FlatFile, Server, SocketIO } from 'boardgame.io/server';
import { AzureStorage, Compression } from 'bgio-azure-storage';
import fs from 'fs';
import Koa from 'koa';
import cors from '@koa/cors';
import mount from 'koa-mount';
import send from 'koa-send';
import serve from 'koa-static';
import path from 'path';
import config from './config';
import { loadGames } from './utils';

let db;

if (config.AZURE_STORAGE_ACCOUNT) {
  db = new AzureStorage({
    client: new BlobServiceClient(
      `https://${config.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
      new DefaultAzureCredential(),
    ),
    container: config.AZURE_STORAGE_CONTAINER,
    compression: Compression.gzip,
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

const games = loadGames();

const server = Server({
  games,
  db,
  transport,
});

if (config.FRONTEND_ROOT) {
  server.app.use(cors({ origin: config.FRONTEND_ROOT }));
} else {
  const publicRoot = path.join(__dirname, '..', '..', 'dist', 'frontend');

  for (const game of games) {
    const filesRoot = path.join(publicRoot, game.name);
    const staticRoot = path.join(filesRoot, 'static');

    const serveGameFrontend = serve(filesRoot, {
      setHeaders: (res, path) => {
        if (path.startsWith(staticRoot)) {
          res.setHeader('cache-control', 'public, max-age=31536000, immutable');
        }
      },
    });

    server.app.use(mount(`/${game.name}`, serveGameFrontend));
  }

  server.app.use((ctx, next) => {
    if (ctx.path === '/') {
      return send(ctx, 'index.html', { root: publicRoot });
    } else {
      return next();
    }
  });
}

if (process.argv.length === 3 && process.argv[2] === 'run') {
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
}
