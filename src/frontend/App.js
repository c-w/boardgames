import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Client from './Client';
import Lobby from './Lobby';
import RoomList from './RoomList';

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
            children={({ match }) => <RoomList {...match.params} />}
          />
          <Route
            exact
            path="/:gameName/join/:gameID"
            children={({ match }) => <Lobby {...match.params} />}
          />
          <Route
            exact
            path="/:gameName/play/:gameID/:playerID/:credentials"
            children={({ match }) => <Client {...match.params} />}
          />
        </Switch>
      </main>
    </HashRouter>
  );
}
