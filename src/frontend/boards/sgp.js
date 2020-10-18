import React from 'react';
import { getNumRound } from '../../shared/games/sgp';
import { sum } from '../../shared/utils';
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
 */
export default function Board({ G, ctx, playerID, moves }) {
  const { hand, picked } = G.players[playerID];
  const { scores } = G;
  const played = G.played[playerID];
  const { gameover } = ctx;

  const pickCard = (i) => (event) => {
    event.preventDefault();

    if (!picked) {
      moves.pickCard(i);
    }
  };

  if (gameover) {
    return (
      <div>
        <div>{gameover.winner === playerID ? 'You won' : 'You lost'}</div>
        <div>Score: {sum(scores[playerID])}</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        Round: {getNumRound(ctx)}
        {picked && (<em>Waiting for other players&hellip;</em>)}
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
        <figcaption>Played</figcaption>
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
    </div>
  );
}
