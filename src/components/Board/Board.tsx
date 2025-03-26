import React from "react";
import { Piece, Position } from "../../hooks/useGameState";
import "./Board.css";

interface BoardProps {
  rows: number;
  cols: number;
  pieces: Piece[];
  selectedPiece: string | null;
  tempPosition: Position | null;
  onPieceClick: (pieceId: string, event: React.MouseEvent) => void;
}

export const Board: React.FC<BoardProps> = ({
  rows,
  cols,
  pieces,
  selectedPiece,
  tempPosition,
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
            style={{
              top: `calc(${row} * var(--cell-size))`,
              left: `calc(${col} * var(--cell-size))`,
            }}
          />
        );
      }
    }
    return board;
  };

  const renderPieces = () => {
    return pieces.map((piece) => {
      const position =
        selectedPiece === piece.id && tempPosition
          ? tempPosition
          : piece.position;

      const style = {
        top: `calc(${position.row} * var(--cell-size))`,
        left: `calc(${position.col} * var(--cell-size))`,
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
        >
          {piece.squares.map((square, index) => (
            <div
              key={index}
              className={`piece-square ${
                piece.id === "square" ? `color-${index + 1}` : ""
              }`}
              style={{
                top: `calc(${square.row} * var(--cell-size))`,
                left: `calc(${square.col} * var(--cell-size))`,
              }}
            />
          ))}
        </div>
      );
    });
  };

  return (
    <div className="board">
      <div className="board-inner">
        {renderBoard()}
        {renderPieces()}
      </div>
    </div>
  );
};
