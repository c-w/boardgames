import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Lobby from './Lobby';
import Play from './Play';
import MatchList from './MatchList';
import Wait from './Wait';

const gameName = 'fitf'; // TODO: make this dynamic

export default function App() {
  return (
    <HashRouter>
      <main>
        <Switch>
          <Route
            exact
            path="/"
            children={<Redirect to={`/${gameName}/join`} />}
          />
          <Route
            exact
            path="/:gameName/new"
            children={({ match }) => <Lobby {...match.params} />}
          />
          <Route
            exact
            path="/:gameName/join"
            children={({ match }) => <MatchList {...match.params} />}
          />
          <Route
            exact
            path="/:gameName/join/:matchID"
            children={({ match }) => <Lobby {...match.params} />}
          />
          <Route
            exact
            path="/:gameName/wait/:matchID/:playerID/:credentials"
            children={({ match }) => <Wait {...match.params} />}
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
