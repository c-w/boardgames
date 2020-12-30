import { readdirSync } from 'fs';
import * as path from 'path';

/**
 * @typedef {import('boardgame.io').Game} Game
 */

/**
 * @returns {Array<Game & { shortName: string }>}
 */
export function loadGames() {
  const gamesDir = path.join(__dirname, '..', 'shared', 'games');

  return readdirSync(gamesDir)
    .filter(file => file.endsWith('.js') && !file.endsWith('.test.js'))
    .map(file => ({
      ...require(path.join(gamesDir, file)).default,
      shortName: path.basename(file, '.js'),
    }))
    .sort((game1, game2) => game1.name.localeCompare(game2.name));
}
