import React from 'react';
import { Link } from 'react-router-dom';
import { NIGIRIS, ROLLS, APPETIZERS, SPECIALS, DESSERTS, getNumRound } from '../../shared/games/sgp';
import { partition, range, sum } from '../../shared/utils';
import './sgp.scoped.scss';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/src/types').LobbyAPI.Match} Match **/
/** @typedef {import('../../shared/games/sgp').G} G */
/** @typedef {import('../../shared/games/sgp').Card} Card */

/**
 * @param {Object} props
 * @param {Ctx} props.ctx
 * @param {Card} props.card
 */
function HelpText({ ctx, card }) {
  let content;

  switch (card.name) {
    case NIGIRIS.egg:
      content = <span>1 point</span>;
      break;

    case NIGIRIS.salmon:
      content = <span>2 points</span>;
      break;

    case NIGIRIS.squid:
      content = <span>3 points</span>;
      break;

    case ROLLS.maki:
      content = ctx.numPlayers <= 5
        ? <span>Most: 6/3</span>
        : <span>Most: 6/4/2</span>;
      break;

    case ROLLS.temaki:
      content = ctx.numPlayers <= 2
        ? <span>Most: 4</span>
        : <span>Most: 4<br />Least: -4</span>;
      break;

    case ROLLS.uramaki:
      content = <span>First to 10: 8/5/2</span>;
      break;

    case APPETIZERS.dumpling:
      content = <span>1 3 6 10 15</span>;
      break;

    case APPETIZERS.edamame:
      content = <span>1 per opponents with edamame</span>;
      break;

    case APPETIZERS.eel:
      content = <span>×1 = -3<br />×2 = +7</span>;
      break;

    case APPETIZERS.onigiri:
      content = <span>Unique: 1 4 9 16</span>;
      break;

    case APPETIZERS.misoSoup:
      content = <span>3 points<br />Discard if any others played this turn</span>;
      break;

    case APPETIZERS.sashimi:
      content = <span>×3 = 10</span>;
      break;

    case APPETIZERS.tempura:
      content = <span>×2 = 5</span>;
      break;

    case APPETIZERS.tofu:
      content = <span>×1 = 2<br />×2 = 6<br />×3+ = 0</span>;
      break;

    case SPECIALS.soySauce:
      content = <span>Most colors: 4</span>;
      break;

    case SPECIALS.tea:
      content = <span>1 per card in your biggest set</span>;
      break;

    case SPECIALS.wasabi:
      content = <span>Next nigiri ×3</span>;
      break;

    case DESSERTS.greenTeaIceCream:
      content = <span>×4 = 12</span>;
      break;

    case DESSERTS.pudding:
      content = ctx.numPlayers <= 2
        ? <span>Most: 6</span>
        : <span>Most: 6<br />Least: -6</span>;
      break;

    case DESSERTS.fruit:
      content = <span>Per type:<br />(-2) 0 1 3 6 10</span>;
      break;

    default:
      console.error(`Unknown card: ${card.name}`);
      return null;
  }

  return <aside>{content}</aside>;
}

/**
 * @param {Object} props
 * @param {Ctx} props.ctx
 * @param {Card} props.card
 */
function Card({ ctx, card }) {
  const { name, category, count, variants } = card;

  return (
    <div className={`${category} card`}>
      <div>
        {name}
        {variants && <span>&nbsp;({variants.join(' + ')})</span>}
        {count && <span>&nbsp;(x{count})</span>}
      </div>
      <HelpText ctx={ctx} card={card} />
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
  const numRound = getNumRound(ctx);
  const { gameover } = ctx;
  const otherPlayerIDs = Object.keys(G.played).filter(id => id !== playerID);

  const playerNameFor = id => matchData.find(player => `${player.id}` === id)?.name || `Player ${id}`;

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
      <div className="sgp gameover">
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
            {otherPlayerIDs.map(id =>
              <ScoreRow key={id} playerID={id} />
            )}
          </tbody>
        </table>
        <Link to="/sgp/new">Click to play another game</Link>
      </div>
    );
  }

  const PlayedCards = ({ playerID, picked=undefined, name=undefined }) => {
    const cards = partition(G.played[playerID], card => card.round != null);

    return (
      <figure>
        <figcaption>{name || playerNameFor(playerID)}</figcaption>
        <div className="playedCards">
          <ul>
            {cards.true.map((card, i) => (
              <li key={i}>
                <Card card={card} ctx={ctx} />
              </li>
            ))}
          </ul>
          <ol>
            {cards.false.map((card, i) => (
              <li key={i}>
                <Card card={card} ctx={ctx} />
              </li>
            ))}
            {picked && (
              <li>
                <Card card={picked} ctx={ctx} />
              </li>
            )}
          </ol>
        </div>
      </figure>
    );
  };

  return (
    <div className="sgp">
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
                <Card card={card} ctx={ctx} />
              </button>
            </li>
          ))}
        </ul>
      </figure>
      <PlayedCards playerID={playerID} picked={picked} name="You" />
      {otherPlayerIDs.map(id =>
        <PlayedCards key={id} playerID={id} />
      )}
    </div>
  );
}
