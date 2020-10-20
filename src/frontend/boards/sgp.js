import React from 'react';
import { getNumRound } from '../../shared/games/sgp';
import { range, sum } from '../../shared/utils';
import './sgp.scoped.css';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/src/types').LobbyAPI.Match} Match **/
/** @typedef {import('../../shared/games/sgp').G} G */
/** @typedef {import('../../shared/games/sgp').Card} Card */

/**
 * @param {Card} props
 */
function Card({ name, category, count, variants }) {
  return (
    <div className={category}>
      {name}
      {variants && <span>({variants.join(' + ')})</span>}
      {count && <span>(x{count})</span>}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {G} props.G
 * @param {Ctx} props.ctx
 * @param {string} props.playerID
 * @param {any} props.moves
 * @param {Match['players']} props.matchData
 */
export default function Board({ G, ctx, playerID, moves, matchData }) {
  const { hand, picked } = G.players[playerID];
  const score = sum(G.scores[playerID]);
  const played = G.played[playerID];
  const numRound = getNumRound(ctx);
  const { gameover } = ctx;

  const playerNameFor = id => matchData.find(player => `${player.id}` === id)?.name || `Player ${id}`;

  const withoutSelf = map => Object.entries(map).filter(([id, _]) => id !== playerID);

  const pickCard = (i) => (event) => {
    event.preventDefault();

    if (!picked) {
      moves.pickCard(i);
    }
  };

  if (gameover) {
    const ScoreRow = ({ playerID, name=undefined }) => (
      <tr>
        <th scope="row">{name || playerNameFor(playerID)}</th>
        {range(numRound).map(i =>
          <td key={i}>{G.scores[playerID][i]}</td>
        )}
        <td>{sum(G.scores[playerID])}</td>
      </tr>
    );

    return (
      <div>
        <em>{gameover.winner === playerID ? 'You won' : 'You lost'}</em>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              {range(numRound).map(i =>
                <th key={i}>Round {i + 1}</th>
              )}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <ScoreRow playerID={playerID} name="You" />
            {withoutSelf(G.scores).map(([id, _]) =>
              <ScoreRow key={id} playerID={id} />
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          Round: {numRound}
        </div>
        {score > 0 && <div>
          Score: {score}
        </div>}
        {picked && <div>
          <em>Waiting for other players&hellip;</em>
        </div>}
      </div>
      <figure>
        <figcaption>Hand</figcaption>
        <ul>
          {hand.map((card, i) => (
            <li key={i}>
              <button onClick={pickCard(i)} disabled={picked != null}>
                <Card {...card} />
              </button>
            </li>
          ))}
        </ul>
      </figure>
      <figure>
        <figcaption>You</figcaption>
        <ol>
          {played.map((card, i) => (
            <li key={i}>
              <Card {...card} />
            </li>
          ))}
          {picked && (
            <li>
              <Card {...picked} />
            </li>
          )}
        </ol>
      </figure>
      {withoutSelf(G.played).map(([id, cards]) =>
        <figure key={id}>
          <figcaption>{playerNameFor(id)}</figcaption>
          <ol>
            {cards.map((card, i) => (
              <li key={i}>
                <Card {...card} />
              </li>
            ))}
          </ol>
        </figure>
      )}
    </div>
  );
}
