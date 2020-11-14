#!/usr/bin/env babel-node

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sh from 'shelljs';
import * as yargs from 'yargs';
import { loadGames } from '../src/backend/utils';

sh.set('-e');

const rootDir = `${__dirname}/..`;
const games = loadGames();

function loadGameConfig(gameName) {
  const gameEnv = `${rootDir}/src/frontend/boards/${gameName}/build.env`;
  dotenv.config({ path: gameEnv });
  return gameEnv;
}

function buildServerTemplates() {
  const templatePath = path.join(__dirname, '..', 'src', 'backend', 'index.html.njk');
  const rendered = nunjucks.render(templatePath, { games });
  sh.mkdir('-p', `${rootDir}/dist/frontend`);
  fs.writeFileSync(`${rootDir}/dist/frontend/index.html`, rendered, { encoding: 'utf-8' });
}

function workOnGame(gameName) {
  const gameEnv = loadGameConfig(gameName);
  sh.cp(gameEnv, `${rootDir}/.env.local`);
  sh.mkdir('-p', `${rootDir}/public`);
  sh.ls(`${rootDir}/src/frontend/public/*.njk`).forEach(templatePath => {
    const rendered = nunjucks.render(templatePath, { env: process.env });
    const fileName = path.basename(templatePath, '.njk');
    fs.writeFileSync(`${rootDir}/public/${fileName}`, rendered, { encoding: 'utf-8' });
  });
  sh.cp(`${rootDir}/src/frontend/boards/${gameName}/public/*`, `${rootDir}/public`);
}

function buildGame(gameName) {
  loadGameConfig(gameName);
  const longName = games.find(game => game.shortName === gameName).name;
  workOnGame(gameName);
  sh.pushd('-q', rootDir);
  sh.exec('npx craco build');
  sh.popd('-q');
  sh.mkdir('-p', `${rootDir}/dist/frontend/${longName}`);
  sh.mv(`${rootDir}/build/*`, `${rootDir}/dist/frontend/${longName}`);
}

yargs
  .command({
    command: 'build-server-templates',
    describe: 'Compile server templates to HTML',
    handler: buildServerTemplates,
  })
  .command({
    command: 'workon',
    describe: 'Activate a game module',
    builder: yargs => yargs.option('game', { alias: 'g', choices: games.map(game => game.shortName), demandOption: true }),
    handler: argv => workOnGame(argv.game),
  })
  .command({
    command: 'build',
    describe: 'Compile a game to a static frontend bundle',
    builder: yargs => yargs.option('game', { alias: 'g', choices: games.map(game => game.shortName), demandOption: true }),
    handler: argv => buildGame(argv.game),
  })
  .parse();
