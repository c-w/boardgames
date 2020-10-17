import { useEffect, useState } from 'react';

/**
 * @param {string} gameName
 */
function importGame(gameName) {
  switch (gameName) {
    case 'fitf':
      return import('../shared/games/fitf');

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

/**
 * @param {string} gameName
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
