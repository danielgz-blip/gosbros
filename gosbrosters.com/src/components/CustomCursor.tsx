"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverData = target.closest("[data-cursor-text]");
      if (hoverData) {
        setLabel(hoverData.getAttribute("data-cursor-text") || "");
        setIsHovering(true);
      } else {
        const interactive = target.closest("a, button, [data-cursor-hover]");
        if (interactive) {
          setIsHovering(true);
          setLabel("");
        } else {
          setIsHovering(false);
        }
      }
    };

    const updatePosition = () => {
      // Smooth lerp (0.15 for smooth lag)
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }

      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    const animationId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`cursor-container ${isHovering ? "is-action" : ""}`}
    >
      <div className="cursor__circle" ref={circleRef}></div>
      <div className="cursor__dot" ref={dotRef}></div>
      <div className="cursor__text">
        <span className="cursor__label" ref={labelRef}>
          {label}
        </span>
      </div>
    </div>
  );
}

