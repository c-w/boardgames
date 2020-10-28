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
    case 'the-fox-in-the-forest':
      return [
        () => import('../shared/games/fitf'),
        () => import('./boards/fitf'),
      ];

    case 'sushi-go-party':
      return [
        () => import('../shared/games/sgp'),
        () => import('./boards/sgp'),
      ];

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

/**
 * @param {string} gameName
 * @returns {{ game?: Game, board?: BoardComponent }}
 */
export function useGame(gameName) {
  const [imported, setImported] = useState({ game: null, board: null });

  useEffect(() => {
    const [ gameImporter, boardImporter ] = importGame(gameName);

    const boardComponent = lazy(boardImporter);

    gameImporter().then((gameModule) => setImported({
      game: gameModule.default,
      board: boardComponent,
    }));
  }, [gameName]);

  return imported;
}
