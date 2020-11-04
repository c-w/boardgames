import React from 'react';
import Loading from './Loading';
import { useGame } from './hooks';

/**
 * @param {object} props
 * @param {string} props.gameName
 */
export default function Rules({ gameName }) {
  const { rules } = useGame(gameName);

  if (rules == null) {
    return <Loading />;
  }

  return <div className="rules" dangerouslySetInnerHTML={{ __html: rules }} />;
}
