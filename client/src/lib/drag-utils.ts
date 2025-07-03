import { useCallback, useRef } from 'react';

interface DragResizeConfig {
  element: HTMLElement | null;
  onDragStart?: () => void;
  onDragEnd?: (position: { left: number; width: number }) => void;
  onDragging?: (position: { left: number; width: number }) => void;
}

interface DragState {
  isDragging: boolean;
  isResizing: 'left' | 'right' | false;
  startX: number;
  startLeft: number;
  startWidth: number;
}

export function useDragResize({ element, onDragStart, onDragEnd, onDragging }: DragResizeConfig) {
  const dragState = useRef<DragState>({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startLeft: 0,
    startWidth: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!element || (!dragState.current.isDragging && !dragState.current.isResizing)) return;

    e.preventDefault();
    const deltaX = e.clientX - dragState.current.startX;
    const containerRect = element.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const containerWidth = containerRect.width;
    const deltaPercentage = (deltaX / containerWidth) * 100;

    let newLeft = dragState.current.startLeft;
    let newWidth = dragState.current.startWidth;

    if (dragState.current.isDragging) {
      // Moving the entire block
      newLeft = Math.max(0, Math.min(100 - newWidth, dragState.current.startLeft + deltaPercentage));
    } else if (dragState.current.isResizing === 'left') {
      // Resizing from the left
      const maxDelta = dragState.current.startWidth - 5; // Minimum width of 5%
      const clampedDelta = Math.max(-dragState.current.startLeft, Math.min(maxDelta, deltaPercentage));
      newLeft = dragState.current.startLeft + clampedDelta;
      newWidth = dragState.current.startWidth - clampedDelta;
    } else if (dragState.current.isResizing === 'right') {
      // Resizing from the right
      const maxWidth = 100 - dragState.current.startLeft;
      newWidth = Math.max(5, Math.min(maxWidth, dragState.current.startWidth + deltaPercentage));
    }

    // Apply the changes to the element
    element.style.left = `${newLeft}%`;
    element.style.width = `${newWidth}%`;

    onDragging?.({ left: newLeft, width: newWidth });
  }, [element, onDragging]);

  const handleMouseUp = useCallback(() => {
    if (!element || (!dragState.current.isDragging && !dragState.current.isResizing)) return;

    const rect = element.getBoundingClientRect();
    const containerRect = element.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    const left = ((rect.left - containerRect.left) / containerRect.width) * 100;
    const width = (rect.width / containerRect.width) * 100;

    dragState.current.isDragging = false;
    dragState.current.isResizing = false;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    onDragEnd?.({ left, width });
  }, [element, handleMouseMove, onDragEnd]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!element) return;

    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const rect = element.getBoundingClientRect();
    const containerRect = element.parentElement?.getBoundingClientRect();
    if (!containerRect) return;

    dragState.current.startX = e.clientX;
    dragState.current.startLeft = ((rect.left - containerRect.left) / containerRect.width) * 100;
    dragState.current.startWidth = (rect.width / containerRect.width) * 100;

    // Determine if this is a resize handle
    if (target.classList.contains('resize-handle-left')) {
      dragState.current.isResizing = 'left';
    } else if (target.classList.contains('resize-handle-right')) {
      dragState.current.isResizing = 'right';
    } else {
      dragState.current.isDragging = true;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    onDragStart?.();
  }, [element, handleMouseMove, handleMouseUp, onDragStart]);

  return { onMouseDown };
}
