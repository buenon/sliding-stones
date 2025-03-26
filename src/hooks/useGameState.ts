import { useCallback, useEffect, useState } from "react";
import { useGameLogic } from "./useGameLogic";

export type PieceType = "L" | "square";
export type PieceColor = "yellow" | "red" | "brown" | "orange" | "multi";

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  position: Position;
  color: PieceColor;
  squares: Position[];
}

export const useGameState = () => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [tempPosition, setTempPosition] = useState<Position | null>(null);

  const { checkWinCondition, isValidMove } = useGameLogic(pieces, 6, 4);

  // Add effect to check win condition whenever pieces change
  useEffect(() => {
    if (checkWinCondition()) {
      // Delay setting game as won by 500ms to show the final position
      const timer = setTimeout(() => {
        setGameWon(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pieces, checkWinCondition]);

  const initializeGame = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isOneMoveBeforeWin = urlParams.get("mock") === "true";

    const initialPieces: Piece[] = isOneMoveBeforeWin
      ? [
          {
            id: "L1",
            type: "L",
            position: { row: 0, col: 0 },
            color: "yellow",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
            ],
          },
          {
            id: "L2",
            type: "L",
            position: { row: 0, col: 2 },
            color: "red",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "L3",
            type: "L",
            position: { row: 2, col: 0 },
            color: "brown",
            squares: [
              { row: 0, col: 0 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "L4",
            type: "L",
            position: { row: 3, col: 2 },
            color: "orange",
            squares: [
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "square",
            type: "square",
            position: { row: 1, col: 1 }, // One move before win position
            color: "multi",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
        ]
      : [
          // Original initial pieces
          {
            id: "L1",
            type: "L",
            position: { row: 0, col: 0 },
            color: "yellow",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
            ],
          },
          {
            id: "L2",
            type: "L",
            position: { row: 0, col: 2 },
            color: "red",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "L3",
            type: "L",
            position: { row: 2, col: 0 },
            color: "brown",
            squares: [
              { row: 0, col: 0 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "L4",
            type: "L",
            position: { row: 2, col: 2 },
            color: "orange",
            squares: [
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
          {
            id: "square",
            type: "square",
            position: { row: 4, col: 1 },
            color: "multi",
            squares: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
          },
        ];

    setPieces(initialPieces);
    setMoveCount(0);
    setGameWon(false);
  }, []);

  const resetGame = useCallback(() => {
    initializeGame();
    setSelectedPiece(null);
    setTempPosition(null);
  }, [initializeGame]);

  const updatePiecePosition = useCallback(
    (pieceId: string, newPosition: Position) => {
      setPieces((prevPieces) =>
        prevPieces.map((piece) =>
          piece.id === pieceId ? { ...piece, position: newPosition } : piece
        )
      );
      setMoveCount((prev) => prev + 1);
      setTempPosition(null);
    },
    []
  );

  const updateTempPosition = useCallback(
    (pieceId: string, dx: number, dy: number) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece) return;

      const cellSize = 100; // This should match the CSS variable
      const rowDelta = Math.round(dy / cellSize);
      const colDelta = Math.round(dx / cellSize);

      const newPosition = {
        row: piece.position.row + rowDelta,
        col: piece.position.col + colDelta,
      };

      // Only update temp position if the move is valid
      if (isValidMove(pieceId, newPosition)) {
        setTempPosition(newPosition);
      }
    },
    [pieces, isValidMove]
  );

  const commitMove = useCallback(
    (pieceId: string) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece || !tempPosition) return;

      // Only commit the move if the piece has moved from its original position
      // and the move is valid
      if (
        (tempPosition.row !== piece.position.row ||
          tempPosition.col !== piece.position.col) &&
        isValidMove(pieceId, tempPosition)
      ) {
        updatePiecePosition(pieceId, tempPosition);
      }
      setTempPosition(null);
    },
    [pieces, tempPosition, isValidMove, updatePiecePosition]
  );

  return {
    pieces,
    selectedPiece,
    gameWon,
    moveCount,
    tempPosition,
    setSelectedPiece,
    setGameWon,
    initializeGame,
    resetGame,
    updatePiecePosition,
    updateTempPosition,
    commitMove,
  };
};
