
import React from 'react';
import { useMediaQuery } from 'react-responsive';

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div>
      {isMobile ? <p>Widok mobilny</p> : <p>Widok desktopowy</p>}
    </div>
  );
};

export default ResponsiveComponent;
