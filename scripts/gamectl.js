#!/usr/bin/env babel-node

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import * as sh from 'shelljs';

const rootDir = `${__dirname}/..`;
const args = process.argv.slice(2);
const command = args[0];
const gameName = args[1];

let game;

try {
  game = require(`${rootDir}/src/shared/games/${gameName}`).default;
} catch (ex) {
  console.error(`Unknown game: ${gameName}`);
  sh.exit(1);
}

const gameEnv = `${rootDir}/src/frontend/boards/${gameName}/build.env`;

dotenv.config({ path: gameEnv });

sh.set('-e');

switch (command) {
  case 'workon':
    sh.cp(gameEnv, `${rootDir}/.env.local`);
    sh.mkdir('-p', `${rootDir}/public`);
    sh.ls(`${rootDir}/src/frontend/public/*.njk`).forEach(templatePath => {
      const rendered = nunjucks.render(templatePath, { env: process.env });
      const fileName = path.basename(templatePath, '.njk');
      fs.writeFileSync(`${rootDir}/public/${fileName}`, rendered, { encoding: 'utf-8' });
    });
    sh.cp(`${rootDir}/src/frontend/boards/${gameName}/public/*`, `${rootDir}/public`);
    break;

  case 'build':
    sh.pushd('-q', rootDir);
    sh.exec(`yarn run workon-${gameName}`);
    sh.exec('npx craco build');
    sh.popd('-q');
    sh.mkdir('-p', `${rootDir}/dist/${game.name}`);
    sh.mv(`${rootDir}/build/*`, `${rootDir}/dist/${game.name}`);
    break;

  default:
    console.error(`Unknown command: ${command}`);
    sh.exit(2);
}
