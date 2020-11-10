import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Loading from './Loading';
import Lobby from './Lobby';
import Play from './Play';
import GameList from './GameList';
import MatchList from './MatchList';
import Rules from './Rules';
import Wait from './Wait';
import { useGame } from './hooks';
import { renderGameName } from '../shared/utils';

/**
 * @param {object} props
 * @param {string} props.gameName
 * @param {any} props.children
 */
function DefaultLayout({ gameName, children }) {
  const { game, icon } = useGame(gameName);

  if (game == null) {
    return (
      <main className={gameName}>
        <Loading />
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{renderGameName(gameName)}</title>
        {icon && <link rel="icon" href={icon} />}
      </Helmet>

      <main className={gameName}>
        {children}
      </main>
    </>
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
            <main>
              <GameList />
            </main>
          )}
        />
        <Route
          exact
          path="/:gameName/new"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName}>
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
            <DefaultLayout gameName={match.params.gameName}>
              <MatchList {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/join/:matchID"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName}>
              <Lobby {...match.params} />
            </DefaultLayout>
          )}
        />
        <Route
          exact
          path="/:gameName/wait/:matchID/:playerID/:credentials"
          children={({ match }) => (
            <DefaultLayout gameName={match.params.gameName}>
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
