import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import { isMoveInvalid } from '../../../shared/games/fitf';
import { last, sum } from '../../../shared/utils';
import './index.scss';

/** @typedef {import('boardgame.io/dist/types/src/types').Ctx} Ctx **/
/** @typedef {import('boardgame.io/dist/types/src/types').LobbyAPI.Match} Match **/
/** @typedef {import('../../../shared/games/fitf').Card} Card */
/** @typedef {import('../../../shared/games/fitf').G} G */

const CARD_TEXTS = {
  1: 'If you play this and lose the trick, you lead the next trick.',
  3: 'When you play this, you may exchange the trump card with a card from your hand.',
  5: 'When you play this, draw 1 card. Then discard any 1 card.',
  7: 'The winner of the trick receives 1 point for each 7 in the trick.',
  9: 'When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.',
  11: 'When you lead this, if your opponent has a card of this suit, they must play either the 1 of this suit or their highest ranked card of this suit.',
};

/**
 * @param {object} props
 * @param {Card} props.card
 * @param {boolean=} props.compact
 * @param {boolean=} props.won
 * @param {boolean=} props.isNew
 * @param {boolean=} props.isOld
 */
function Card({ card, compact, won, isNew, isOld }) {
  return (
    <span className={classNames('card', card.suit, { won, new: isNew, old: isOld })}>
      <span className={classNames('content', { compact })}>
        <span className="rank">{card.rank}</span>
        <span className="suit">{card.suit}</span>
      </span>
    </span>
  );
}

/**
 * @param {object} props
 * @param {Card?} props.card
 */
function HelpText({ card }) {
  const [shown, setShown] = useState(card?.rank % 2 === 1);

  const onClick = useCallback(() => {
    setShown(false);
  }, [setShown]);

  if (!card || !shown) {
    return null;
  }

  return (
    <aside onClick={onClick}>
      {CARD_TEXTS[card.rank]}
    </aside>
  )
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
  const history = useHistory();
  const [chosen, setChosen] = useState([]);
  const [showEndOfRoundScreen, setShowEndOfRoundScreen] = useState(false);

  const playCard = (event) => {
    event.preventDefault();
    moves.playCard(...chosen);
    setChosen([]);
  };

  const discardCard = (event) => {
    event.preventDefault();
    moves.discardCard(...chosen);
    setChosen([]);
  };

  const onClick = (i) => (event) => {
    if (event.target.checked) {
      setChosen([...chosen, i]);
    } else {
      setChosen(chosen.filter(x => x !== i));
    }
  };

  const canPlay = (i) => {
    if (!isActive) {
      return false;
    }

    if (chosen.includes(i)) {
      return true;
    }

    if (isDiscard) {
      return chosen.length === 0;
    }

    if (isMoveInvalid(G, ctx, ...chosen, i)) {
      return false;
    }

    return true;
  };

  const goToNextRound = (event) => {
    event.preventDefault();
    setShowEndOfRoundScreen(false);
  };

  const goToNewGame = (event) => {
    event.preventDefault();
    history.push('/new');
  };

  const isActive = playerID === ctx.currentPlayer;
  const isDiscard = ctx.activePlayers && ctx.activePlayers[playerID] === 'discard';
  const isPicked = chosen.length !== 0;
  const isEndOfRound = G.tricks.length === 0 && G.history.length > 0;
  const player = G.players[playerID];
  const opponent = matchData.find(u => u.id !== Number(playerID));
  const otherPlayerID = opponent.id.toString();
  const tricksWon = G.tricks.filter(t => t.winner === playerID).length;
  const tricksLost = G.tricks.filter(t => t.winner !== playerID).length;
  const trump = last(G.trumps);
  const previousTrump = trump.turn > 0 && ctx.turn - trump.turn <= 1 ? G.trumps[G.trumps.length - 2] : null;
  const lastTrick = isEndOfRound && showEndOfRoundScreen ? last(last(G.history)) : G.tricks.length >= 1 ? last(G.tricks) : null;
  const firstPickedCard = chosen.length > 0 ? player.hand[chosen[0]] : null;

  useEffect(() => {
    if (isEndOfRound) {
      setShowEndOfRoundScreen(true);
    }
  }, [setShowEndOfRoundScreen, isEndOfRound]);

  const hand = player.hand.map((card, i) => ({ card, i })).sort((a, b) => {
    return a.card.suit === b.card.suit
      ? a.card.rank - b.card.rank
      : a.card.suit.localeCompare(b.card.suit);
  });

  const Stats = ({ showHistory=false, hideTricks=false }) => (
    <div className="stats">
      <div className="score">
        <span className="label">Your score</span>
        <span>{sum(G.scores[playerID])}</span>
        {showHistory && (
          <span>
            (+ {last(G.scores[playerID])})
          </span>
        )}
        {ctx.gameover?.winner === playerID && (
          <span>
            <span role="img" aria-label="You won">👑</span>
          </span>
        )}
      </div>
      <div className="score">
        <span className="label">{opponent.name} score</span>
        <span>{sum(G.scores[otherPlayerID])}</span>
        {showHistory && (
          <span>
            (+ {last(G.scores[otherPlayerID])})
          </span>
        )}
        {ctx.gameover?.winner === otherPlayerID && (
          <span>
            <span role="img" aria-label={`${opponent.name} won`}>👑</span>
          </span>
        )}
      </div>
      {!hideTricks && (
        <div className="tricks">
          <span className="label">Your tricks</span>
          <span>{tricksWon}</span>
        </div>
      )}
      {!hideTricks && (
        <div className="tricks">
          <span className="label">{opponent.name} tricks</span>
          <span>{tricksLost}</span>
        </div>
      )}
    </div>
  );

  if (ctx.gameover) {
    return (
      <form onSubmit={goToNewGame} className="end-of-game">
        <Stats showHistory hideTricks />
        <input type="submit" value="Play again" />
      </form>
    );
  }

  if (showEndOfRoundScreen) {
    return (
      <form onSubmit={goToNextRound} className="end-of-round">
        <Stats showHistory hideTricks />
        <input type="submit" value="Continue" />
      </form>
    );
  }

  let playerAction;

  if (isActive && isDiscard) {
    playerAction = 'Discard card';
  } else if (isActive && isPicked) {
    playerAction = 'Play card';
  } else if (isActive) {
    playerAction = 'Your move!';
  } else {
    playerAction = `Waiting for ${opponent.name}…`;
  }

  return (
    <form onSubmit={isDiscard ? discardCard : playCard} className={classNames({ disabled: !isActive })}>
      <div className="board">
        <div className="info">
          <Stats />
          <div className="current-trick">
            <input
              className={classNames({ active: isActive, picked: isPicked })}
              type="submit"
              disabled={!isActive || !isPicked}
              value={playerAction}
            />
            {G.played && (
              <div className="played">
                <div className="label">{isActive ? `${opponent.name} played` : 'You played'}</div>
                <Card card={G.played} />
              </div>
            )}
          </div>
          <div className="history">
            <div className="trump">
              <span className="label">Trump</span>
              {previousTrump && (
                <Card card={previousTrump} compact isOld />
              )}
              <Card card={trump} compact />
            </div>
            {lastTrick && (
              <div className="last-trick">
                <span className="label">Last</span>
                <Card
                  card={lastTrick.cards[0]}
                  compact
                  won={lastTrick.winner === lastTrick.cards[0].playerID}
                />
                <Card
                  card={lastTrick.cards[1]}
                  compact
                  won={lastTrick.winner === lastTrick.cards[1].playerID}
                />
              </div>
            )}
          </div>
        </div>
        <ol className="hand">
          {hand.map(({ card, i }) =>
            <li key={`${card.rank}-${card.suit}`}>
              <label>
                <input
                  type="checkbox"
                  onChange={onClick(i)}
                  disabled={!canPlay(i)}
                  checked={chosen.includes(i)}
                />
                <Card card={card} isNew={isDiscard && i === hand.length - 1} />
              </label>
            </li>
          )}
        </ol>
      </div>
      <HelpText card={firstPickedCard} key={`${firstPickedCard?.suit}-${firstPickedCard?.rank}`} />
    </form>
  );
}
