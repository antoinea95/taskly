import { useRef, useState } from "react";
import { useTaskModalState } from "./useTaskModalState";

/**
 * Custom hook to enable drag-to-scroll functionality for a horizontal scrollable container.
 * This hook provides handlers for mouse events to enable smooth dragging behavior.
 * 
 * @returns - The hook returns a set of values and functions to manage drag behavior:
 *   - `sliderRef`: A reference to the scrollable container (HTMLDivElement).
 *   - `isDragging`: A boolean indicating if the user is currently dragging the container.
 *   - `handleMouseDown`: Mouse down handler that initiates the dragging behavior.
 *   - `handleMouseLeaveOrUp`: Mouse leave/up handler that stops the dragging behavior.
 *   - `handleMouseMove`: Mouse move handler that updates the scroll position based on mouse movement.
 */
export const useDragMouse = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isModalOpen = useTaskModalState();

  /**
   * Handles the `mousedown` event and starts the dragging process by capturing the
   * starting X position and the initial scroll position.
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event triggered on `mousedown`.
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen || !sliderRef.current) return;
      setIsDragging(true);
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
  };

  /**
   * Handles the `mouseleave` or `mouseup` events to stop the dragging behavior.
   */
  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  /**
   * Handles the `mousemove` event and updates the scroll position of the container
   * based on the mouse movement while dragging.
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event triggered on `mousemove`.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen || !isDragging || !sliderRef.current) return; // Disable drag if modal is open
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multiplier to increase scroll speed
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return {
    sliderRef,
    isDragging,
    handleMouseDown,
    handleMouseLeaveOrUp,
    handleMouseMove,
  };
};
