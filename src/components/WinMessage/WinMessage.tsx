import React from "react";
import "./WinMessage.css";

interface WinMessageProps {
  moveCount: number;
  onPlayAgain: () => void;
}

export const WinMessage: React.FC<WinMessageProps> = ({
  moveCount,
  onPlayAgain,
}) => {
  return (
    <div className="win-message-overlay">
      <div className="win-message">
        <h2>Congratulations! You solved the puzzle!</h2>
        <p>You completed the puzzle in {moveCount} moves.</p>
        <p>
          The optimal solution takes 22 moves. Try again to beat your score!
        </p>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
};
