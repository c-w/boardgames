import React from 'react';

/**
 * @param {object} props
 * @param {string} props.rules
 */
export default function Rules({ rules }) {
  return <div className="rules" dangerouslySetInnerHTML={{ __html: rules }} />;
}
