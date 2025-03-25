import React from "react";
import { Piece } from "../../hooks/useGameState";
import "./Board.css";

interface BoardProps {
  rows: number;
  cols: number;
  pieces: Piece[];
  selectedPiece: string | null;
  onPieceClick: (
    pieceId: string,
    event: React.MouseEvent | React.TouchEvent
  ) => void;
}

export const Board: React.FC<BoardProps> = ({
  rows,
  cols,
  pieces,
  selectedPiece,
  onPieceClick,
}) => {
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        board.push(
          <div
            key={`cell-${row}-${col}`}
            className="board-cell"
            data-row={row}
            data-col={col}
          />
        );
      }
    }
    return board;
  };

  const renderPieces = () => {
    return pieces.map((piece) => {
      const style = {
        top: `${piece.position.row * 100}px`,
        left: `${piece.position.col * 100}px`,
      };

      const pieceClass = `piece ${piece.type} ${piece.color} ${
        selectedPiece === piece.id ? "selected" : ""
      }`;

      return (
        <div
          key={piece.id}
          className={pieceClass}
          style={style}
          onMouseDown={(e) => onPieceClick(piece.id, e)}
          onTouchStart={(e) => onPieceClick(piece.id, e)}
        >
          {piece.squares.map((square, index) => (
            <div
              key={index}
              className={`piece-square ${
                piece.id === "square" ? `color-${index + 1}` : ""
              }`}
              style={{
                top: `${square.row * 100}px`,
                left: `${square.col * 100}px`,
              }}
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div className="board">
      {renderBoard()}
      {renderPieces()}
    </div>
  );
};
