import React from "react";
import "./Instructions.css";

export const Instructions: React.FC = () => {
  return (
    <div className="instructions">
      <h3>How to Play:</h3>
      <ol>
        <li>Goal: Slide the pieces to move the square into the center frame</li>
        <li>Try to solve the puzzle in the minimum 22 moves!</li>
      </ol>
    </div>
  );
};
