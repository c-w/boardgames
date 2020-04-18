import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Client from './Client';
import Lobby from './Lobby';

export default function App() {
  return (
    <HashRouter>
      <main>
        <Switch>
          <Route
            exact
            path="/"
            children={<Redirect to="/new" />}
          />
          <Route
            exact
            path="/new"
            children={Lobby}
          />
          <Route
            exact
            path="/join/:gameID"
            children={({ match }) => <Lobby {...match.params} />}
          />
          <Route
            exact
            path="/play/:gameID/:playerID/:credentials"
            children={({ match }) => <Client {...match.params} />}
          />
        </Switch>
      </main>
    </HashRouter>
  );
}
