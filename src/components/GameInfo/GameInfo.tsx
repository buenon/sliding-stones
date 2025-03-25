import React from "react";
import "./GameInfo.css";

interface GameInfoProps {
  moveCount: number;
  onReset: () => void;
}

export const GameInfo: React.FC<GameInfoProps> = ({ moveCount, onReset }) => {
  return (
    <div className="game-info">
      <p className="move-count">Moves: {moveCount}</p>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};
