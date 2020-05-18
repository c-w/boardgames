import { lazy } from 'react';

function importBoard(gameName) {
  switch (gameName) {
    case 'fitf':
      return import('./fitf');

    default:
      throw new Error(`Unhandled board name: ${gameName}`);
  }
}

export default function loadBoard(gameName) {
  return lazy(() => importBoard(gameName));
}
