import React, { useRef, useEffect } from 'react';

const ClickOutsideComponent = ({ children, onClickOutside }) => {
  const componentRef = useRef(null);

  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      onClickOutside();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return <div ref={componentRef}>{children}</div>;
};

export default ClickOutsideComponent;