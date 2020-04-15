import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Client from './Client';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/:gameID/:playerID"
          children={({ match }) => <Client {...match.params} /> }
        />
      </Switch>
    </HashRouter>
  );
}
