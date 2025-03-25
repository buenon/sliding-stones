import { useCallback } from "react";
import { Piece, Position } from "./useGameState";

export const useGameLogic = (pieces: Piece[], ROWS: number, COLS: number) => {
  const getAbsoluteSquares = useCallback((piece: Piece) => {
    return piece.squares.map((square) => ({
      row: piece.position.row + square.row,
      col: piece.position.col + square.col,
    }));
  }, []);

  const isPositionOccupied = useCallback(
    (row: number, col: number, excludePieceId?: string) => {
      for (const piece of pieces) {
        if (excludePieceId && piece.id === excludePieceId) continue;

        const absoluteSquares = getAbsoluteSquares(piece);
        if (
          absoluteSquares.some(
            (square) => square.row === row && square.col === col
          )
        ) {
          return true;
        }
      }
      return false;
    },
    [pieces, getAbsoluteSquares]
  );

  const isValidMove = useCallback(
    (pieceId: string, newPosition: Position) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return false;

      const tempPiece = { ...piece, position: newPosition };
      const absoluteSquares = getAbsoluteSquares(tempPiece);

      if (
        absoluteSquares.some(
          (square) =>
            square.row < 0 ||
            square.row >= ROWS ||
            square.col < 0 ||
            square.col >= COLS
        )
      ) {
        return false;
      }

      if (
        absoluteSquares.some((square) =>
          isPositionOccupied(square.row, square.col, pieceId)
        )
      ) {
        return false;
      }

      return true;
    },
    [pieces, ROWS, COLS, isPositionOccupied, getAbsoluteSquares]
  );

  const checkWinCondition = useCallback(() => {
    const square = pieces.find((p) => p.id === "square");
    if (!square) return false;

    // Get all L-shaped pieces
    const lPieces = pieces.filter((p) => p.id !== "square");
    if (lPieces.length !== 4) return false;

    // Function to check if a position is occupied by a specific L piece
    const isPositionPartOfPiece = (piece: Piece, row: number, col: number) => {
      return getAbsoluteSquares(piece).some(
        (square) => square.row === row && square.col === col
      );
    };

    // Get square position (top-left corner of the 2x2 square)
    const { row, col } = square.position;

    // Check if there's at least one L piece that forms each corner pattern
    const hasTopLeft = lPieces.some(
      (piece) =>
        isPositionPartOfPiece(piece, row - 1, col - 1) &&
        isPositionPartOfPiece(piece, row - 1, col) &&
        isPositionPartOfPiece(piece, row, col - 1)
    );

    const hasTopRight = lPieces.some(
      (piece) =>
        isPositionPartOfPiece(piece, row - 1, col + 1) &&
        isPositionPartOfPiece(piece, row - 1, col + 2) &&
        isPositionPartOfPiece(piece, row, col + 2)
    );

    const hasBottomLeft = lPieces.some(
      (piece) =>
        isPositionPartOfPiece(piece, row + 1, col - 1) &&
        isPositionPartOfPiece(piece, row + 2, col - 1) &&
        isPositionPartOfPiece(piece, row + 2, col)
    );

    const hasBottomRight = lPieces.some(
      (piece) =>
        isPositionPartOfPiece(piece, row + 1, col + 2) &&
        isPositionPartOfPiece(piece, row + 2, col + 2) &&
        isPositionPartOfPiece(piece, row + 2, col + 1)
    );

    return hasTopLeft && hasTopRight && hasBottomLeft && hasBottomRight;
  }, [pieces, getAbsoluteSquares]);

  return {
    isValidMove,
    checkWinCondition,
  };
};
