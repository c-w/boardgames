import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { FlatFile, Server, SocketIO } from 'boardgame.io/server';
import { AzureStorage, Compression } from 'bgio-azure-storage';
import fs from 'fs';
import Koa from 'koa';
import cors from '@koa/cors';
import mount from 'koa-mount';
import { Environment, FileSystemLoader } from 'nunjucks';
import serve from 'koa-static';
import path from 'path';
import config from './config';
import { renderGameName } from '../shared/utils';

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

const gamesDir = path.join(__dirname, '..', 'shared', 'games');

const games = fs.readdirSync(gamesDir)
  .filter(file => file.endsWith('.js') && !file.endsWith('.test.js'))
  .map(file => require(path.join(gamesDir, file)).default);

const server = Server({
  games,
  db,
  transport,
});

export function renderIndex() {
  const nunjucks = new Environment(new FileSystemLoader(__dirname));

  nunjucks.addFilter('renderGameName', renderGameName);

  return nunjucks.render('index.html.njk', { games });
}

if (config.FRONTEND_ROOT) {
  server.app.use(cors({ origin: config.FRONTEND_ROOT }));
} else {
  for (const game of games) {
    const filesRoot = path.join(__dirname, '..', '..', 'dist', game.name);
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

  const indexHtml = renderIndex();

  server.app.use((ctx, next) => {
    if (ctx.path === '/') {
      ctx.body = indexHtml;
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
