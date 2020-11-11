import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
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
 * @param {any} props.children
 */
function DefaultLayout({ gameName, children }) {
  return (
    <main className={gameName}>
      {children}
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
            <DefaultLayout gameName={gameName}>
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
