import { lazy, useEffect, useState } from 'react';

/**
 * @typedef {import('boardgame.io').Game} Game
 * @typedef {import('boardgame.io/react').BoardProps} BoardProps
 * @typedef {import('react').ComponentType<BoardProps>} BoardComponent
 */

/**
 * @param {string} gameName
 * @returns {any[]}
 */
function importGame(gameName) {
  switch (gameName) {
    case 'the-vole-in-the-valley':
      return [
        () => import('../shared/games/fitf'),
        () => import('../shared/games/fitf.md'),
        () => import('./boards/fitf'),
        () => null,
      ];

    case 'sashimi-express':
      return [
        () => import('../shared/games/sgp'),
        () => import('../shared/games/sgp.md'),
        () => import('./boards/sgp'),
        () => import('./boards/sgp.png'),
      ];

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

/**
 * @param {string} gameName
 * @returns {{
 *   game?: Game,
 *   board?: BoardComponent,
 *   rules?: string,
 *   icon?: string,
 * }}
 */
export function useGame(gameName) {
  const [imported, setImported] = useState({
    game: null,
    board: null,
    rules: null,
    icon: null,
  });

  useEffect(() => {
    const [
      gameImporter,
      rulesImporter,
      boardImporter,
      iconImporter,
    ] = importGame(gameName);

    const boardComponent = lazy(boardImporter);

    Promise.all([
      gameImporter(),
      rulesImporter(),
      iconImporter(),
    ]).then(([
      gameModule,
      rulesModule,
      iconModule,
    ]) => {
      setImported({
        game: gameModule.default,
        board: boardComponent,
        rules: rulesModule.default,
        icon: iconModule?.default,
      });
    });
  }, [gameName]);

  return imported;
}
