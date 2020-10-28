import { lazy } from 'react';

/**
 * @param {string} gameName
 * @returns {any}
 */
function importBoard(gameName) {
  switch (gameName) {
    case 'the-fox-in-the-forest':
      return import('./fitf');

    case 'sushi-go-party':
      return import('./sgp');

    default:
      throw new Error(`Unhandled board name: ${gameName}`);
  }
}

/**
 * @param {string} gameName
 * @returns {any}
 */
export default function loadBoard(gameName) {
  return lazy(() => importBoard(gameName));
}
