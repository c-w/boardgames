import { useEffect, useState } from 'react';

function importGame(gameName) {
  switch (gameName) {
    case 'fitf':
      return import('../shared/games/fitf');

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

export function useGame(gameName) {
  const [imported, setImported] = useState();

  useEffect(() => {
    importGame(gameName).then(module => {
      setImported(module.default);
    });
  }, [gameName]);

  return imported;
}
