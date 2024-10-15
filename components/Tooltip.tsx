import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
  parentRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, parentRef, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<{ top: boolean; left: boolean }>({
    top: true,
    left: true,
  });
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showTooltip && tooltipRef.current && parentRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();

      const newPosition = { top: true, left: true };

      if (parentRect.left > tooltipRect.left) {
        newPosition.left = false;
      }

      if (parentRect.top > tooltipRect.top) {
        newPosition.top = false;
      }

      setPosition(newPosition);
    }
  }, [showTooltip, parentRef]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`bg-backgroundSecondary absolute 
            ${position.top ? 'bottom-full mb-2' : 'top-full mt-2'} 
            ${position.left ? 'right-0' : 'left-0'} 
            w-max text-foreground text-center text-sm px-3 py-1 rounded shadow-lg z-50`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
