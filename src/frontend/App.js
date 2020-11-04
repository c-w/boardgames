import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import Lobby from './Lobby';
import Play from './Play';
import GameList from './GameList';
import MatchList from './MatchList';
import Rules from './Rules';
import Wait from './Wait';
import styles from './App.module.css';

/**
 * @param {Object} props
 * @param {string=} props.gameName
 * @param {boolean=} props.narrow
 * @param {any} props.children
 */
function DefaultLayout({ gameName, narrow, children }) {
  return (
    <main className={classNames(gameName, { [styles.narrow]: narrow })}>
      {children}
    </main>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          children={() => (
            <DefaultLayout narrow>
              <GameList />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/new"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName} narrow>
              <Lobby {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/rules"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName}>
              <Rules {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/join"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName} narrow>
              <MatchList {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/join/:matchID"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName} narrow>
              <Lobby {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/wait/:matchID/:playerID/:credentials"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName} narrow>
              <Wait {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/play/:matchID/:playerID/:credentials"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName}>
              <Play {...match.params} />
            </DefaultLayout>
          )}
        />
      </Switch>
    </HashRouter>
  );
}
