import { useEffect, useState } from 'react';

/**
 * @param {string} gameName
 * @returns {any}
 */
function importGame(gameName) {
  switch (gameName) {
    case 'the-fox-in-the-forest':
      return import('../shared/games/fitf');

    case 'sushi-go-party':
      return import('../shared/games/sgp');

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

/**
 * @param {string} gameName
 * @returns {any}
 */
export function useGame(gameName) {
  const [imported, setImported] = useState(null);

  useEffect(() => {
    importGame(gameName).then(module => {
      setImported(module.default);
    });
  }, [gameName]);

  return imported;
}
