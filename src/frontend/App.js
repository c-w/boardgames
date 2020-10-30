import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Lobby from './Lobby';
import Play from './Play';
import GameList from './GameList';
import MatchList from './MatchList';
import Wait from './Wait';
import styles from './App.module.css';

function DefaultLayout({ children }) {
  return (
    <div className={styles.narrow}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <main>
        <Switch>
          <Route
            exact
            path="/"
            children={() => <DefaultLayout><GameList /></DefaultLayout>}
          />
          <Route
            exact
            path="/:gameName/new"
            children={({ match }) => <DefaultLayout><Lobby {...match.params} /></DefaultLayout>}
          />
          <Route
            exact
            path="/:gameName/join"
            children={({ match }) => <DefaultLayout><MatchList {...match.params} /></DefaultLayout>}
          />
          <Route
            exact
            path="/:gameName/join/:matchID"
            children={({ match }) => <DefaultLayout><Lobby {...match.params} /></DefaultLayout>}
          />
          <Route
            exact
            path="/:gameName/wait/:matchID/:playerID/:credentials"
            children={({ match }) => <DefaultLayout><Wait {...match.params} /></DefaultLayout>}
          />
          <Route
            exact
            path="/:gameName/play/:matchID/:playerID/:credentials"
            children={({ match }) => <Play {...match.params} />}
          />
        </Switch>
      </main>
    </HashRouter>
  );
}
