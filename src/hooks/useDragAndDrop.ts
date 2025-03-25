import { useCallback, useEffect, useRef, useState } from "react";

const MIN_DRAG_DISTANCE = 30;

export const useDragAndDrop = (
  onMove: (direction: "up" | "down" | "left" | "right") => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleDragStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      setIsDragging(true);
      dragStartPos.current = { x: clientX, y: clientY };
    },
    []
  );

  const handleDragMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !dragStartPos.current) return;

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      const dx = clientX - dragStartPos.current.x;
      const dy = clientY - dragStartPos.current.y;

      if (
        Math.abs(dx) > MIN_DRAG_DISTANCE ||
        Math.abs(dy) > MIN_DRAG_DISTANCE
      ) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            onMove("right");
          } else {
            onMove("left");
          }
        } else {
          if (dy > 0) {
            onMove("down");
          } else {
            onMove("up");
          }
        }

        setIsDragging(false);
        dragStartPos.current = null;
      }
    },
    [isDragging, onMove]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartPos.current = null;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e as unknown as React.TouchEvent);
      }
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
};
