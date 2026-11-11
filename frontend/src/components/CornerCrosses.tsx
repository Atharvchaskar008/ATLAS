import React from 'react';

/**
 * Architectural corner crosses matching the Arccheo / SAKER visual design system.
 * Subtly scales on card hover.
 */
export const CornerCrosses: React.FC = () => {
  return (
    <>
      <span className="corner-cross corner-cross-tl" aria-hidden="true" />
      <span className="corner-cross corner-cross-tr" aria-hidden="true" />
      <span className="corner-cross corner-cross-bl" aria-hidden="true" />
      <span className="corner-cross corner-cross-br" aria-hidden="true" />
    </>
  );
};

export default CornerCrosses;

