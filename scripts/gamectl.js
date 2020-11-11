#!/usr/bin/env babel-node

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

sh.set('-e');

switch (command) {
  case 'workon':
    sh.cp(`${rootDir}/src/frontend/boards/${gameName}/build.env`, `${rootDir}/.env.local`);
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
