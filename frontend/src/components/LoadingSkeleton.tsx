import React from "react";

interface LoadingSkeletonProps {
  lines?: number;
  height?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ lines = 3, height = 20 }) => {
  return (
    <div>
      {Array.from({ length: lines }).map((_, idx) => (
        <div className="placeholder-glow mb-2" key={idx}>
          <span className="placeholder col-12" style={{ height, display: 'block' }}></span>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton; 