import React, { useCallback, useEffect } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useGameLogic } from "../../hooks/useGameLogic";
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
    setSelectedPiece,
    initializeGame,
    resetGame,
    updatePiecePosition,
  } = useGameState();

  const { isValidMove } = useGameLogic(pieces, ROWS, COLS);

  const movePiece = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!selectedPiece) return;

      const piece = pieces.find((p) => p.id === selectedPiece);
      if (!piece) return;

      let newPosition;
      switch (direction) {
        case "up":
          newPosition = {
            row: piece.position.row - 1,
            col: piece.position.col,
          };
          break;
        case "down":
          newPosition = {
            row: piece.position.row + 1,
            col: piece.position.col,
          };
          break;
        case "left":
          newPosition = {
            row: piece.position.row,
            col: piece.position.col - 1,
          };
          break;
        case "right":
          newPosition = {
            row: piece.position.row,
            col: piece.position.col + 1,
          };
          break;
      }

      if (isValidMove(piece.id, newPosition)) {
        updatePiecePosition(piece.id, newPosition);
      }
    },
    [selectedPiece, pieces, isValidMove, updatePiecePosition]
  );

  const { handleDragStart } = useDragAndDrop(movePiece);

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
        onPieceClick={handlePieceClick}
      />
      <Instructions />
      {gameWon && <WinMessage moveCount={moveCount} onPlayAgain={resetGame} />}
    </div>
  );
};

export default MainBoard;
