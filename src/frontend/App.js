import React from 'react';
import { HashRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import Lobby from './Lobby';
import Play from './Play';
import MatchList from './MatchList';
import Rules from './Rules';
import Wait from './Wait';

/**
 * @typedef {import('boardgame.io').Game} Game
 * @typedef {import('boardgame.io/react').BoardProps} BoardProps
 * @typedef {import('react').ComponentType<BoardProps>} BoardComponent
 */

/**
 * @param {object} props
 * @param {string} props.gameName
 * @param {boolean=} props.showHelp
 * @param {any} props.children
 */
function DefaultLayout({ gameName, showHelp, children }) {
  const userAgent = navigator.userAgent.toLowerCase();
  const android = userAgent.includes('android');
  const safari = userAgent.includes('safari');

  return (
    <main className={classNames(gameName, { android, safari })}>
      {children}

      {showHelp !== false && (
        <Link className="help" to="/rules" target="_blank">
          <span>View rules</span>
        </Link>
      )}
    </main>
  );
}

/**
 * @param {object} props
 * @param {Game} props.game
 * @param {BoardComponent} props.board
 * @param {string} props.rules
 */
export default function App(props) {
  const gameName = props.game.name;

  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          children={() => (
            <Redirect to="/join" />
          )}
        />
        <Route
          exact
          path="/new"
          children={() => (
            <DefaultLayout gameName={gameName}>
              <Lobby {...props} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/rules"
          children={() => (
            <DefaultLayout gameName={gameName} showHelp={false}>
              <Rules {...props} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/join"
          children={() => (
            <DefaultLayout gameName={gameName}>
              <MatchList {...props} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/join/:matchID"
          children={({ match }) => (
            <DefaultLayout gameName={gameName}>
              <Lobby {...match.params} {...props} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/wait/:matchID/:playerID/:credentials"
          children={({ match }) => (
            <DefaultLayout gameName={gameName}>
              <Wait {...match.params} {...props} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/play/:matchID/:playerID/:credentials"
          children={({ match }) => (
            <DefaultLayout gameName={gameName}>
              <Play {...match.params} {...props} />
            </DefaultLayout>
          )}
        />
      </Switch>
    </HashRouter>
  );
}
