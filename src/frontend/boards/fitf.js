import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isMoveInvalid } from '../../shared/games/fitf';
import { last, sum } from '../../shared/utils';

const CARD_TEXTS = {
  1: 'If you play this and lose the trick, you lead the next trick.',
  3: 'When you play this, you may exchange the trump card with a card from your hand.',
  5: 'When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck (face down).',
  7: 'The winner of the trick receives 1 point for each 7 in the trick.',
  9: 'When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.',
  11: 'When you lead this, if your opponent has a card of this suit, they must play either the 1 of this suit or their highest ranked card of this suit.',
};

function Card({ rank, suit }) {
  return (
    <span className={suit}>
      {rank} of {suit}
    </span>
  );
}

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
    history.push('/fitf/new');
  };

  const isOver = ctx.gameover != null;
  const isWinner = isOver && ctx.gameover.winner === playerID;
  const isActive = playerID === ctx.currentPlayer;
  const isDiscard = ctx.activePlayers && ctx.activePlayers[playerID] === 'discard';
  const isEndOfRound = G.tricks.length === 0 && G.history.length > 0;
  const player = G.players[playerID];
  const opponent = matchData.find(u => u.id !== Number(playerID));
  const tricksWon = G.tricks.filter(t => t.winner === playerID).length;
  const tricksLost = G.tricks.filter(t => t.winner !== playerID).length;
  const trump = last(G.trumps);
  const previousTrump = trump.turn > 0 && ctx.turn - trump.turn <= 1 ? G.trumps[G.trumps.length - 2] : null;
  const lastTrick = isEndOfRound && showEndOfRoundScreen ? last(last(G.history)) : G.tricks.length >= 1 ? last(G.tricks) : null;
  const helpText = chosen.length > 0 ? CARD_TEXTS[player.hand[chosen[0]].rank] : null;

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

  const Stats = ({ disabled, showHistory, hideTricks }) => (
    <fieldset disabled={disabled}>
      <legend>Stats</legend>
      <div>
        Your score: {sum(G.scores[playerID])}
        {showHistory && (
          <span>
            &nbsp;(+ {last(G.scores[playerID])})
          </span>
        )}
      </div>
      <div>
        {opponent.name} score: {sum(G.scores[opponent.id])}
        {showHistory && (
          <span>
            &nbsp;(+ {last(G.scores[opponent.id])})
          </span>
        )}
      </div>
      {!hideTricks && (
        <div>
          Your tricks: {tricksWon}
        </div>
      )}
      {!hideTricks && (
        <div>
          {opponent.name} tricks: {tricksLost}
        </div>
      )}
      {lastTrick && (
        <div>
          Last trick:&nbsp;
          <Card {...lastTrick.cards[0]} /> vs <Card {...lastTrick.cards[1]} />&nbsp;
          (you {lastTrick.winner === playerID ? 'won' : 'lost'})
        </div>
      )}
    </fieldset>
  );

  if (isOver) {
    return (
      <form onSubmit={goToNewGame}>
        <Stats showHistory hideTricks />
        <div>
          <em>{isWinner ? 'You won!' : 'You lost.'}</em>
        </div>
        <input
          type="submit"
          value="Click to play another game"
        />
      </form>
    );
  }

  if (showEndOfRoundScreen) {
    return (
      <form onSubmit={goToNextRound}>
        <Stats showHistory hideTricks />
        <input
          type="submit"
          value="Ok, proceed to next round"
        />
      </form>
    );
  }

  return (
    <form onSubmit={isDiscard ? discardCard : playCard}>
      <Stats disabled={!isActive} />
      <fieldset disabled={!isActive}>
        <legend>This trick</legend>
        <div>
          Trump:&nbsp;
          <Card {...trump} />
          {previousTrump && (
            <React.Fragment>
              &nbsp;(was <Card {...previousTrump} />)
            </React.Fragment>
          )}
        </div>
        {G.played && (
          <div>
            {isActive ? `${opponent.name} played` : 'You played'}:&nbsp;
            <Card {...G.played} />
          </div>
        )}
        <em>{isActive ? 'Your move!' : `Waiting for ${opponent.name}...`}</em>
      </fieldset>
      <fieldset disabled={!isActive}>
        <legend>Your hand</legend>
        <ol>
          {hand.map(({ card, i }) =>
            <li key={`${card.rank}-${card.suit}`}>
              <label>
                <input
                  type="checkbox"
                  onChange={onClick(i)}
                  disabled={!canPlay(i)}
                  checked={chosen.includes(i)}
                />&nbsp;
                <Card {...card} />
              </label>
              {isDiscard && i === hand.length - 1 && (
                <span>&nbsp;(new)</span>
              )}
            </li>
          )}
        </ol>
      </fieldset>
      <div>
        <input
          type="submit"
          disabled={!isActive || chosen.length === 0}
          value={isDiscard ? 'Discard card' : 'Play card'}
        />
        {helpText && (
          <aside>
            {helpText}
          </aside>
        )}
      </div>
    </form>
  );
}
