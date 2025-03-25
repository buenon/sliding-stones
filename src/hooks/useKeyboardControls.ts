import { useEffect } from "react";

export const useKeyboardControls = (
  onMove: (direction: "up" | "down" | "left" | "right") => void,
  isEnabled: boolean
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isEnabled) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onMove("up");
          break;
        case "ArrowDown":
          event.preventDefault();
          onMove("down");
          break;
        case "ArrowLeft":
          event.preventDefault();
          onMove("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          onMove("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onMove, isEnabled]);
};
