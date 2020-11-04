import React, { Fragment, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { default as game, NIGIRIS, ROLLS, APPETIZERS, SPECIALS, DESSERTS, getNumRound } from '../../shared/games/sgp';
import { partition, range, sum } from '../../shared/utils';
import './sgp.scss';

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
      content = <span>×1 = -3<br />×2+ = +7</span>;
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
 * @param {any=} props.onClick
 * @param {boolean=} props.disabled
 */
function Card({ ctx, card, onClick, disabled }) {
  const { name, category, count, variants } = card;

  const [isHelpTextShown, setIsHelpTextShown] = useState(false);

  const toggleShowHelpText = useCallback((event) => {
    event.preventDefault();
    setIsHelpTextShown(value => !value);
  }, [setIsHelpTextShown]);

  return (
    <button
      className={classNames({ clickable: onClick != null && !disabled })}
      onContextMenu={toggleShowHelpText}
      onClick={disabled ? null : onClick}
      disabled={disabled}
    >
      <div className={classNames('card', category, { showHelpText: isHelpTextShown })}>
        <div className="name">
          {name}
          {count && <span>&nbsp;×{count}</span>}
          {variants && <span>:<br />{variants.map((variant, i) => <span key={i}>{variant}<br /></span>)}</span>}
        </div>
        <HelpText ctx={ctx} card={card} />
      </div>
    </button>
  );
}

function Rules() {
  return (
    <Link
      className="help"
      to={`/${game.name}/rules`}
      target="_blank"
    >
      <span role="img" aria-label="View rules">❓</span>
    </Link>
  )
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
  const numRound = getNumRound(ctx);
  const { gameover, turn } = ctx;
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
        <th scope="row">
          {name || playerNameFor(playerID)}
          {gameover.winner === playerID && <span role="img" aria-label="Winner">🏆</span>}
        </th>
        {range(numRound).map(i =>
          <td key={i}>{G.scores[playerID][i]}</td>
        )}
        <td>{sum(G.scores[playerID])}</td>
      </tr>
    );

    return (
      <div className="gameover">
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
        <Link to={`/${game.name}/new`}>Click to play another game</Link>
      </div>
    );
  }

  const PlayedCards = ({ playerID, picked=undefined, name=undefined }) => {
    const cards = partition(G.played[playerID], card => card.round != null);
    const score = sum(G.scores[playerID]);

    return (
      <figure>
        <figcaption>
          {name || playerNameFor(playerID)}
          {score > 0 && <span>, score {score}</span>}
        </figcaption>
        <ol>
          {cards.true.map((card, i) => (
            <li key={`${i}-${card.round}`}>
              <Card card={card} ctx={ctx} />
            </li>
          ))}
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
      </figure>
    );
  };

  return (
    <Fragment>
      {picked && <em className="status">Waiting for other players&hellip;</em>}
      <figure>
        <figcaption>Round {numRound}, Hand {turn}</figcaption>
        <ul>
          {hand.map((card, i) => (
            <li key={`${i}-${card.name}-${card.category}-${turn}`}>
              <Card
                card={card}
                ctx={ctx}
                onClick={pickCard(i)}
                disabled={picked != null}
              />
            </li>
          ))}
        </ul>
      </figure>
      <PlayedCards playerID={playerID} picked={picked} name="You" />
      {otherPlayerIDs.map(id =>
        <PlayedCards key={id} playerID={id} />
      )}
      <Rules />
    </Fragment>
  );
}
