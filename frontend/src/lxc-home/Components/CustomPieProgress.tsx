import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease";

import AnimatedProgressProvider from "./AnimatedProgressProvider";

const CustomPieProgress = ({
  TextColor,
  Percentage,
  ValueColor,
  PathColor,
  TrailColor,
}) => {
  return (
    <AnimatedProgressProvider
      valueStart={0}
      valueEnd={Percentage}
      duration={1.4}
      easingFunction={easeQuadInOut}
    >
      {(value) => (
        <CircularProgressbar
          value={value}
          text={`${Math.round(value)}%`}
          strokeWidth={5}
          styles={buildStyles({
            textColor: TextColor,
            pathColor: PathColor,
            trailColor: TrailColor,
          })}
        />
      )}
    </AnimatedProgressProvider>
  );
};

export default CustomPieProgress;
