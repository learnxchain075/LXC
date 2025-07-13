import React from "react";
import { useSelector } from "react-redux";

interface LoadingSkeletonProps {
  lines?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: "text" | "card" | "table" | "avatar" | "button";
  width?: string | number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  lines = 3, 
  height = 20, 
  className = "",
  style = {},
  type = "text",
  width = "100%"
}) => {
  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const isDark = dataTheme === "dark_data_theme";

  const getSkeletonClass = () => {
    const baseClass = "placeholder-glow";
    const themeClass = isDark ? "bg-dark" : "bg-light";
    return `${baseClass} ${themeClass} ${className}`.trim();
  };

  const getSkeletonStyle = () => {
    const baseStyle = {
      height: typeof height === "number" ? `${height}px` : height,
      width: typeof width === "number" ? `${width}px` : width,
      ...style
    };
    return baseStyle;
  };

  const renderSkeletonByType = () => {
    switch (type) {
      case "card":
        return (
          <div className={`card ${isDark ? "bg-dark text-light" : "bg-light"}`}>
            <div className="card-body">
              <div className="placeholder-glow">
                <span className="placeholder col-6 mb-2" style={{ height: "1.5rem" }}></span>
                <span className="placeholder col-4 mb-2" style={{ height: "1rem" }}></span>
                <span className="placeholder col-8" style={{ height: "1rem" }}></span>
              </div>
            </div>
          </div>
        );

      case "table":
        return (
          <div className={`table-responsive ${isDark ? "table-dark" : ""}`}>
            <table className={`table ${isDark ? "table-dark" : ""}`}>
              <thead>
                <tr>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <th key={idx}>
                      <span className="placeholder col-12" style={{ height: "1rem" }}></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: lines }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: 5 }).map((_, colIdx) => (
                      <td key={colIdx}>
                        <span className="placeholder col-12" style={{ height: "1rem" }}></span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "avatar":
        return (
          <div className="d-flex align-items-center">
            <div className={`avatar avatar-md rounded-circle me-3 ${isDark ? "bg-secondary" : "bg-light"}`}>
              <span className="placeholder" style={{ width: "100%", height: "100%" }}></span>
            </div>
            <div className="flex-grow-1">
              <span className="placeholder col-6 mb-1" style={{ height: "1rem" }}></span>
              <span className="placeholder col-4" style={{ height: "0.8rem" }}></span>
            </div>
          </div>
        );

      case "button":
        return (
          <button 
            className={`btn btn-secondary disabled ${isDark ? "bg-dark" : ""}`}
            style={{ width: typeof width === "number" ? `${width}px` : width }}
            disabled
          >
            <span className="placeholder" style={{ height: "1rem" }}></span>
          </button>
        );

      default: // text
        return (
          <div className={getSkeletonClass()}>
            {Array.from({ length: lines }).map((_, idx) => (
              <span 
                key={idx} 
                className="placeholder col-12 mb-2" 
                style={getSkeletonStyle()}
              ></span>
            ))}
          </div>
        );
    }
  };

  return renderSkeletonByType();
};

export default LoadingSkeleton; 