import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './frontend/App';
import './index.scss';

/**
 * @param {string} gameName
 * @returns {Promise<any>[]}
 */
function importGame(gameName) {
  switch (gameName) {
    case 'the-vole-in-the-valley':
      return [
        import('./shared/games/fitf'),
        import('./frontend/boards/fitf/rules.md'),
        import('./frontend/boards/fitf'),
        import('./frontend/boards/fitf/index.scss'),
      ];

    case 'sashimi-express':
      return [
        import('./shared/games/sgp'),
        import('./frontend/boards/sgp/rules.md'),
        import('./frontend/boards/sgp'),
        import('./frontend/boards/sgp/index.scss'),
      ];

    default:
      throw new Error(`Unhandled game name: ${gameName}`);
  }
}

const importers = importGame(process.env.REACT_APP_BUILD_TARGET);

Promise.all(importers).then(([
  gameModule,
  rulesModule,
  boardModule,
  _styleModule,
]) => {
  ReactDOM.render(
    <StrictMode>
      <App
        board={boardModule.default}
        game={gameModule.default}
        rules={rulesModule.default}
      />
    </StrictMode>,
    document.getElementById('root')
  );
});
