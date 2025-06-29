import React from "react";
import "./CustomLoader.css";

interface LoaderProps {
  size?: number;
  color?: string;
  variant?:
    | "spinner"
    | "dots"
    | "bars"
    | "pulse"
    | "typewriter"
    | "ring"
    | "wave"
    | "cube"
    | "circleBounce"
    | "glow";
}

const CustomLoader: React.FC<LoaderProps> = ({
  size = 40,
  color = "#3d85c6",
  variant = "spinner",
}) => {
  return (
    <div className="custom-loader-overlay">
      {variant === "spinner" && (
        <div
          className="spinner"
          style={{
            width: size,
            height: size,
            borderColor: `${color} transparent transparent transparent`,
          }}
        />
      )}

      {variant === "dots" && (
        <div className="dots">
          <span style={{ backgroundColor: color }} />
          <span style={{ backgroundColor: color }} />
          <span style={{ backgroundColor: color }} />
        </div>
      )}

      {variant === "bars" && (
        <div className="bars-loader">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ backgroundColor: color }} />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div
          className="pulse-loader"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
        />
      )}

      {variant === "typewriter" && (
        <div className="typewriter-loader">
          <span>Loading LearnXChain...</span>
        </div>
      )}

      {variant === "ring" && (
        <div className="ring-loader" style={{ borderColor: `${color} transparent` }} />
      )}

      {variant === "wave" && (
        <div className="wave-loader">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ backgroundColor: color }} />
          ))}
        </div>
      )}

      {variant === "cube" && (
        <div className="cube-loader" style={{ backgroundColor: color }} />
      )}

      {variant === "circleBounce" && (
        <div className="circle-bounce-loader">
          <div style={{ backgroundColor: color }} />
          <div style={{ backgroundColor: color }} />
        </div>
      )}

      {variant === "glow" && (
        <div className="glow-loader" style={{ backgroundColor: color }} />
      )}
    </div>
  );
};

export default CustomLoader;
