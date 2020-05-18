import { lazy, useEffect, useState } from 'react';

export function loadBoard(gameName) {
  return lazy(() => {
    switch (gameName) {
      case 'fitf':
        return import('./boards/fitf');

      default:
        throw new Error(`Unhandled board name: ${gameName}`);
    }
  });
}

export function useGame(gameName) {
  const [imported, setImported] = useState();

  useEffect(() => {
    let importer;

    switch (gameName) {
      case 'fitf':
        importer = import('../shared/games/fitf');
        break;

      default:
        throw new Error(`Unhandled game name: ${gameName}`);
    }

    importer.then(module => {
      setImported(module.default);
    });
  }, [gameName]);

  return imported;
}
