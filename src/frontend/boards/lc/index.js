import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { canDrawCardFromDeck, canDrawCardFromDiscard, canPlayCardToBoard, canPlayCardToDiscard, isBet, toOrdinal } from '../../../shared/games/lc';
import { range, sum } from '../../../shared/utils';
import './index.scss';

/** @typedef {import('react').ChangeEvent<HTMLInputElement>} InputChangeEvent **/
/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/src/types').LobbyAPI.Match} Match **/
/** @typedef {import('../../../shared/games/lc').G} G */
/** @typedef {import('../../../shared/games/lc').Card} Card */
/** @typedef {import('../../../shared/games/lc').Cards} Cards */

/**
 * @param {object} props
 * @param {number} props.deckSize
 * @param {number} props.round
 */
function Stats({ deckSize, round }) {
  const cards = range(deckSize).map(i => ({ suit: 'background', rank: (i + 1) * -100}));

  return (
    <div className="stats">
      <span className="rounds">Round {round + 1}</span>
      <Deck cards={cards} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {number} props.points
 */
function Points({ points }) {
  const sign = points < 0 ? <>&minus;</> : undefined;
  const value = Math.abs(points);

  return (
    <span className="points">
      {sign}${value}M
    </span>
  )
}

/**
 * @param {object} props
 * @param {Cards} props.cards
 * @param {number[]} props.scores
 * @param {string} props.caption
 */
function Played({ cards, scores, caption }) {
  return (
    <div className="played">
      <label>{caption}, <Points points={sum(scores)} /></label>
      <ul>
        {Object.entries(cards).map(([suit, cards]) => (
          <li key={suit} className={classNames('suit', suit, `cards-${cards.length}`)}>
            <Deck cards={cards} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {G} props.G
 * @param {Ctx} props.ctx
 * @param {any} props.onPickSuit
 * @param {string} props.pickedSuit
 * @param {boolean} props.disabled
 */
function Discarded({ G, ctx, onPickSuit, pickedSuit, disabled }) {
  const onChange = useCallback((/** @type {InputChangeEvent} */ event) => {
    const suit = event.target.value;
    onPickSuit(suit);
  }, [onPickSuit]);

  return (
    <div className="discarded">
      <label>Discarded cards</label>
      <ul>
        {Object.entries(G.discarded).map(([suit, cards]) => {
          const id = `pickedSuit-${suit}`;
          const checked = suit === pickedSuit;
          return (
            <li key={suit} className={classNames('suit', suit, `cards-${cards.length}`, { checked })}>
              <Deck cards={cards} />
              <input
                type="radio"
                name="pickedSuit"
                value={suit}
                onChange={onChange}
                checked={checked}
                disabled={disabled || canDrawCardFromDiscard(G, ctx, suit) != null}
                id={id}
              />
              <label htmlFor={id}>
                Pick {suit}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {Card} card
 */
function Card(card) {
  return (
    <span className={classNames('card', card.suit)}>
      <span className="rank">{isBet(card) ? 'bet' : card.rank}</span>
    </span>
  )
}

/**
 * @param {object} props
 * @param {Card[]} props.cards
 */
function Deck({ cards }) {
  return (
    <ol className="deck">
      {cards.map(card => (
        <li key={toOrdinal(card)}>
          <Card {...card} />
        </li>
      ))}
    </ol>
  );
}

/**
 * @param {object} props
 * @param {Card[]} props.cards
 * @param {any} props.onPickCard
 * @param {Card} props.pickedCard
 * @param {boolean} props.disabled
 */
function Hand({ cards, onPickCard, pickedCard, disabled }) {
  const onChange = useCallback((/** @type {InputChangeEvent} */ event) => {
    const card = JSON.parse(event.target.value);
    onPickCard(card);
  }, [onPickCard]);

  return (
    <div className="hand">
      <label>Your hand</label>
      <ul>
        {cards.sort((card1, card2) => toOrdinal(card1) - toOrdinal(card2)).map((card) => {
          const id = `pickedCard-${toOrdinal(card)}`;
          const checked = card.suit === pickedCard?.suit && card.rank === pickedCard?.rank;
          return (
            <li key={id} className={classNames({ checked })}>
              <input
                type="radio"
                name="pickedCard"
                value={JSON.stringify(card)}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
                id={id}
              />
              <label htmlFor={id}>
                <Card {...card} />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {G} props.G
 * @param {Ctx} props.ctx
 * @param {any} props.moves
 * @param {Card=} props.card
 * @param {string=} props.suit
 * @param {boolean} props.active
 * @param {string} props.stage
 */
function Actions({ G, ctx, card, suit, moves, active, stage }) {
  let content;

  if (active && stage === 'playCard') {
    content = (
      <>
        <button
          onClick={() => moves.playCardToBoard(card)}
          disabled={card == null || canPlayCardToBoard(G, ctx, card) != null}
        >
          Play card
        </button>
        <button
          onClick={() => moves.playCardToDiscard(card)}
          disabled={card == null || canPlayCardToDiscard(G, ctx, card) != null}
        >
          Discard card
        </button>
      </>
    );
  } else if (active && stage === 'drawCard') {
    content = (
      <>
        <button
          onClick={() => moves.drawCardFromDeck()}
          disabled={canDrawCardFromDeck(G, ctx) != null}
        >
          Draw card
        </button>
        <button
          onClick={() => moves.drawCardFromDiscard(suit)}
          disabled={suit == null || canDrawCardFromDiscard(G, ctx, suit) != null}
        >
          Pick {suit || 'discarded'}
        </button>
      </>
    );
  } else if (!active) {
    content = <em>Waiting for opponent&hellip;</em>
  }

  return (
    <div className="actions">
      {content}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.name
 * @param {boolean} props.winner
 * @param {number[]} props.scores
 */
function ScoreRow({ name, winner, scores }) {
  return (
    <tr>
      <td>
        {name}
        {winner && <span role="img" aria-label="Winner">🏆</span>}
      </td>
      {scores.map((score, i) =>
        <td key={i}><Points points={score} /></td>
      )}
      <td><Points points={sum(scores)} /></td>
    </tr>
  );
}

/**
 * @param {object} props
 * @param {G} props.G
 * @param {Ctx} props.ctx
 * @param {string} props.playerID
 * @param {any} props.moves
 * @param {Match['players']} props.matchData
 */
export default function Board({ G, ctx, playerID, moves, matchData }) {
  const [pickedCard, setPickedCard] = useState(undefined);
  const [pickedSuit, setPickedSuit] = useState(undefined);

  useEffect(() => {
    setPickedCard(undefined);
    setPickedSuit(undefined);
  }, [setPickedCard, setPickedSuit, ctx.turn]);

  const opponent = matchData.find(u => u.id !== Number(playerID));
  const otherPlayerID = opponent.id.toString();
  const isActive = ctx.currentPlayer === playerID;
  const stage = ctx.activePlayers ? ctx.activePlayers[playerID] : 'playCard';

  if (ctx.gameover) {
    const numRounds = G.scores[playerID].length;

    return (
      <div className="gameover">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              {range(numRounds).map(i =>
                <th key={i}>Round {i + 1}</th>
              )}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <ScoreRow
              name="You"
              scores={G.scores[playerID]}
              winner={ctx.gameover.winner === playerID}
            />
            <ScoreRow
              name={opponent.name}
              scores={G.scores[otherPlayerID]}
              winner={ctx.gameover.winner === otherPlayerID}
            />
          </tbody>
        </table>
        <Link to="/new">Click to play another game</Link>
      </div>
    );
  }

  return (
    <div className={classNames({ waiting: !isActive })}>
      <Stats
        deckSize={G.deckSize}
        round={G.round}
      />
      <Played
        cards={G.played[otherPlayerID]}
        scores={G.scores[otherPlayerID]}
        caption={`${opponent.name}'s cards`}
      />
      <Discarded
        G={G}
        ctx={ctx}
        onPickSuit={setPickedSuit}
        pickedSuit={pickedSuit}
        disabled={!isActive || stage !== 'drawCard'}
      />
      <Played
        cards={G.played[playerID]}
        scores={G.scores[playerID]}
        caption="Your cards"
      />
      <Hand
        cards={G.players[playerID].hand}
        onPickCard={setPickedCard}
        pickedCard={pickedCard}
        disabled={!isActive || stage !== 'playCard'}
      />
      <Actions
        G={G}
        ctx={ctx}
        moves={moves}
        card={pickedCard}
        suit={pickedSuit}
        stage={stage}
        active={isActive}
      />
    </div>
  );
}
