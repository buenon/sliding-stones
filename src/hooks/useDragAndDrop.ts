import { useCallback, useEffect, useRef, useState } from "react";

export const useDragAndDrop = (
  onMove: (direction: "up" | "down" | "left" | "right") => void,
  onDragMove: (dx: number, dy: number) => void,
  onDragEnd: (dx: number, dy: number) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastMoveTime = useRef<number>(0);
  const MOVE_INTERVAL = 100; // Minimum time between moves in ms

  const handleDragStart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    const clientX = event.clientX;
    const clientY = event.clientY;

    setIsDragging(true);
    dragStartPos.current = { x: clientX, y: clientY };
    lastMoveTime.current = Date.now();
  }, []);

  const handleDragMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging || !dragStartPos.current) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      const dx = clientX - dragStartPos.current.x;
      const dy = clientY - dragStartPos.current.y;

      const currentTime = Date.now();
      if (currentTime - lastMoveTime.current >= MOVE_INTERVAL) {
        onDragMove(dx, dy);
        lastMoveTime.current = currentTime;
      }
    },
    [isDragging, onDragMove]
  );

  const handleDragEnd = useCallback(
    (event: React.MouseEvent) => {
      if (!isDragging || !dragStartPos.current) return;

      const clientX = event.clientX;
      const clientY = event.clientY;

      const dx = clientX - dragStartPos.current.x;
      const dy = clientY - dragStartPos.current.y;

      onDragEnd(dx, dy);
      setIsDragging(false);
      dragStartPos.current = null;
    },
    [isDragging, onDragEnd]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        handleDragEnd(e as unknown as React.MouseEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
};
