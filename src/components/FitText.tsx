"use client";

import React, { ElementType, forwardRef } from "react";
import { useFitText } from "@/lib/useFitText";

interface FitTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  minFontSize?: number;
  maxFontSize?: number;
  safetyMargin?: number;
  children: React.ReactNode;
  containerClassName?: string;
}

export const FitText = forwardRef<HTMLElement, FitTextProps>(function FitText(
  {
    as: Component = "div",
    minFontSize = 18,
    maxFontSize,
    safetyMargin = 0.98,
    className = "",
    containerClassName = "",
    children,
    style,
    ...props
  },
  forwardedRef
) {
  const { containerRef, textRef } = useFitText<HTMLDivElement, HTMLElement>({
    minFontSize,
    maxFontSize,
    safetyMargin,
  });

  return (
    <div
      ref={containerRef}
      className={`w-full ${containerClassName || "overflow-visible"}`}
    >
      <Component
        ref={(node: HTMLElement | null) => {
          (textRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={`whitespace-nowrap ${className}`}
        style={style}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
});
