import { readdirSync } from 'fs';
import * as path from 'path';

/**
 * @typedef {import('boardgame.io').Game} Game
 */

/**
 * @returns {Game[]}
 */
export function loadGames() {
  const gamesDir = path.join(__dirname, '..', 'shared', 'games');

  return readdirSync(gamesDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.test.js'))
    .map(file => require(path.join(gamesDir, file)).default);
}
