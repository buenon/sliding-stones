import React, { useCallback, useEffect } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useGameState } from "../../hooks/useGameState";
import { Board } from "../Board/Board";
import { GameInfo } from "../GameInfo/GameInfo";
import { Instructions } from "../Instructions/Instructions";
import { WinMessage } from "../WinMessage/WinMessage";
import "./MainBoard.css";

const ROWS = 6;
const COLS = 4;

const MainBoard: React.FC = () => {
  const {
    pieces,
    selectedPiece,
    gameWon,
    moveCount,
    tempPosition,
    setSelectedPiece,
    initializeGame,
    resetGame,
    updateTempPosition,
    commitMove,
  } = useGameState();

  const handleDragMove = useCallback(
    (dx: number, dy: number) => {
      if (!selectedPiece) return;
      updateTempPosition(selectedPiece, dx, dy);
    },
    [selectedPiece, updateTempPosition]
  );

  const handleDragEnd = useCallback(() => {
    if (!selectedPiece) return;
    commitMove(selectedPiece);
    setSelectedPiece(null);
  }, [selectedPiece, commitMove, setSelectedPiece]);

  const { handleDragStart } = useDragAndDrop(handleDragMove, handleDragEnd);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handlePieceClick = useCallback(
    (pieceId: string, event: React.MouseEvent | React.TouchEvent) => {
      setSelectedPiece(pieceId);
      handleDragStart(event);
    },
    [setSelectedPiece, handleDragStart]
  );

  return (
    <div className="main-board-container">
      <h1>Sliding Puzzle</h1>
      <GameInfo moveCount={moveCount} onReset={resetGame} />
      <Board
        rows={ROWS}
        cols={COLS}
        pieces={pieces}
        selectedPiece={selectedPiece}
        tempPosition={tempPosition}
        onPieceClick={handlePieceClick}
      />
      <Instructions />
      {gameWon && <WinMessage moveCount={moveCount} onPlayAgain={resetGame} />}
    </div>
  );
};

export default MainBoard;
