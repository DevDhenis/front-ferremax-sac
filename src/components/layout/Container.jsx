import React from 'react';

const Container = ({ children, className = '', widthPercentage = 95 }) => {
  return (
    <div className="h-full w-full p-6 bg-background overflow-auto h-hidden">
      <div className="flex flex-col justify-content-center items-center">
        <div style={{ width: `${widthPercentage}%` }} className={`${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Container;