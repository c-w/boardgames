import React, { useState } from 'react';
import { isMoveInvalid } from '../shared/game';
import { last, sum } from '../shared/utils';

const CARD_TEXTS = {
  1: 'If you play this and lose the trick, you lead the next trick.',
  3: 'When you play this, you may exchange the trump card with a card from your hand.',
  5: 'When you play this, draw 1 card. Then discard any 1 card to the bottom of the deck (face down).',
  7: 'The winner of the trick receives 1 point for each 7 in the trick.',
  9: 'When determining the winner of a trick with only one 9, treat the 9 as if it were in the trump suit.',
  11: 'When you lead this, if your opponent has a card of this suit, they must play either the 1 of this suit or their highest ranked card of this suit.',
};

function Card({ rank, suit, onClick, enabled }) {
  if (!rank || !suit) {
    return null;
  }

  const card = (
    <span className={suit}>
      {rank} of {suit}
    </span>
  );

  if (!onClick) {
    return card;
  }

  return (
    <label>
      <input
        type="checkbox"
        onClick={onClick}
        disabled={!enabled}
      />
      &nbsp;{card}
    </label>
  );
}

export default function Board({ G, ctx, playerID, moves, gameMetadata }) {
  const [chosen, setChosen] = useState([]);

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

  const isOver = ctx.gameover != null;
  const isWinner = isOver && ctx.gameover.winner === playerID;
  const isActive = playerID === ctx.currentPlayer;
  const isDiscard = ctx.activePlayers && ctx.activePlayers[playerID] === 'discard';
  const player = G.players[playerID];
  const opponent = gameMetadata.find(u => u.id !== playerID);
  const tricksWon = G.tricks.filter(t => t.winner === playerID).length;
  const tricksLost = G.tricks.filter(t => t.winner !== playerID).length;
  const lastTrick = G.tricks.length >= 1 ? last(G.tricks) : null;
  const helpText = chosen.length > 0 ? CARD_TEXTS[player.hand[chosen[0]].rank] : null;

  const hand = player.hand.map((card, i) => ({ card, i })).sort((a, b) => {
    return a.card.suit === b.card.suit
      ? a.card.rank - b.card.rank
      : a.card.suit.localeCompare(b.card.suit);
  });

  if (isOver) {
    return isWinner ? 'You won' : 'You lost';
  }

  return (
    <form onSubmit={isDiscard ? discardCard : playCard}>
      <fieldset disabled={!isActive}>
        <legend>Stats</legend>
        <div>
          Your score: {sum(G.scores[playerID])}
        </div>
        <div>
          {opponent.name} score: {sum(G.scores[opponent.id])}
        </div>
        <div>
          Your tricks: {tricksWon}
        </div>
        <div>
          {opponent.name} tricks: {tricksLost}
        </div>
        {lastTrick && (
          <div>
            Last trick:&nbsp;
            <Card {...lastTrick.cards[0]} /> vs <Card {...lastTrick.cards[1]} />&nbsp;
            (you {lastTrick.winner === playerID ? 'won' : 'lost'})
          </div>
        )}
      </fieldset>
      <fieldset disabled={!isActive}>
        <legend>This trick</legend>
        <div>
          Trump:&nbsp;
          <Card {...G.trump} />
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
              <Card
                {...card}
                onClick={onClick(i)}
                enabled={
                  isActive &&
                  !isMoveInvalid(G, ctx, i) && (
                    chosen.length === 0 ||
                    chosen.includes(i) ||
                    (!isDiscard && chosen.length === 1 && player.hand[chosen[0]].rank === 3)
                  )
                }
              />
            </li>
          )}
        </ol>
      </fieldset>
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
    </form>
  );
}
