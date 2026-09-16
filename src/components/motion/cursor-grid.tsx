"use client";

import { useEffect, useRef } from "react";

type Falloff = "linear" | "smooth" | "sharp";

type CursorGridProps = {
  cellSize?: number;
  color?: string;
  radius?: number;
  falloff?: Falloff;
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  cellRadius?: number;
  clickPulse?: boolean;
  pulseSpeed?: number;
  className?: string;
};

type GridConfig = Required<Omit<CursorGridProps, "className">>;

type Pulse = {
  x: number;
  y: number;
  startedAt: number;
};

const falloffCurves: Record<Falloff, (value: number) => number> = {
  linear: (value) => value,
  smooth: (value) => value * value * (3 - 2 * value),
  sharp: (value) => value * value * value,
};

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized;
  const number = Number.parseInt(value.slice(0, 6), 16);

  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
}

export function CursorGrid({
  cellSize = 70,
  color = "#ffffff",
  radius = 140,
  falloff = "smooth",
  holdTime = 400,
  fadeDuration = 800,
  lineWidth = 1.2,
  maxOpacity = 1,
  fillOpacity = 0,
  gridOpacity = 0,
  cellRadius = 0,
  clickPulse = true,
  pulseSpeed = 600,
  className = "",
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const propsRef = useRef<GridConfig>({
    cellSize,
    color,
    radius,
    falloff,
    holdTime,
    fadeDuration,
    lineWidth,
    maxOpacity,
    fillOpacity,
    gridOpacity,
    cellRadius,
    clickPulse,
    pulseSpeed,
  });

  useEffect(() => {
    propsRef.current = {
      cellSize,
      color,
      radius,
      falloff,
      holdTime,
      fadeDuration,
      lineWidth,
      maxOpacity,
      fillOpacity,
      gridOpacity,
      cellRadius,
      clickPulse,
      pulseSpeed,
    };
    wakeRef.current?.();
  }, [
    cellRadius,
    cellSize,
    clickPulse,
    color,
    fadeDuration,
    falloff,
    fillOpacity,
    gridOpacity,
    holdTime,
    lineWidth,
    maxOpacity,
    pulseSpeed,
    radius,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!container || !canvas || !context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pulses: Pulse[] = [];
    let columns = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;
    let width = 0;
    let height = 0;
    let alphas = new Float32Array(0);
    let touched = new Float64Array(0);
    let animationFrame = 0;
    let running = false;
    let lastFrame = 0;

    const rebuild = () => {
      const config = propsRef.current;
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / config.cellSize) + 1;
      rows = Math.ceil(height / config.cellSize) + 1;
      offsetX = (width - columns * config.cellSize) / 2;
      offsetY = (height - rows * config.cellSize) / 2;
      alphas = new Float32Array(columns * rows);
      touched = new Float64Array(columns * rows);
    };

    const getCellCenter = (index: number): [number, number] => {
      const config = propsRef.current;
      return [
        offsetX + (index % columns) * config.cellSize + config.cellSize / 2,
        offsetY +
          Math.floor(index / columns) * config.cellSize +
          config.cellSize / 2,
      ];
    };

    const energize = (x: number, y: number, boost = 1) => {
      const config = propsRef.current;
      const activeRadius = Math.max(config.radius, 1);
      const ease = falloffCurves[config.falloff];
      const now = performance.now();
      const minColumn = Math.max(
        0,
        Math.floor((x - activeRadius - offsetX) / config.cellSize),
      );
      const maxColumn = Math.min(
        columns - 1,
        Math.floor((x + activeRadius - offsetX) / config.cellSize),
      );
      const minRow = Math.max(
        0,
        Math.floor((y - activeRadius - offsetY) / config.cellSize),
      );
      const maxRow = Math.min(
        rows - 1,
        Math.floor((y + activeRadius - offsetY) / config.cellSize),
      );

      for (let row = minRow; row <= maxRow; row += 1) {
        for (let column = minColumn; column <= maxColumn; column += 1) {
          const index = row * columns + column;
          const [centerX, centerY] = getCellCenter(index);
          const distance = Math.hypot(centerX - x, centerY - y);
          if (distance > activeRadius) continue;

          const level =
            ease(1 - distance / activeRadius) * config.maxOpacity * boost;
          if (level > (alphas[index] ?? 0)) alphas[index] = level;
          if (level > 0) touched[index] = now;
        }
      }
    };

    const draw = (now: number) => {
      const config = propsRef.current;
      const delta = Math.min(now - lastFrame, 50);
      const [red, green, blue] = hexToRgb(config.color);
      lastFrame = now;
      context.clearRect(0, 0, width, height);

      if (config.gridOpacity > 0) {
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${config.gridOpacity})`;
        context.lineWidth = 1;
        context.beginPath();
        for (let column = 0; column <= columns; column += 1) {
          const x = Math.round(offsetX + column * config.cellSize) + 0.5;
          context.moveTo(x, 0);
          context.lineTo(x, height);
        }
        for (let row = 0; row <= rows; row += 1) {
          const y = Math.round(offsetY + row * config.cellSize) + 0.5;
          context.moveTo(0, y);
          context.lineTo(width, y);
        }
        context.stroke();
      }

      for (
        let pulseIndex = pulses.length - 1;
        pulseIndex >= 0;
        pulseIndex -= 1
      ) {
        const pulse = pulses[pulseIndex];
        if (!pulse) continue;
        const ringRadius = ((now - pulse.startedAt) / 1000) * config.pulseSpeed;
        if (ringRadius > Math.hypot(width, height)) {
          pulses.splice(pulseIndex, 1);
          continue;
        }

        const band = config.cellSize;
        const minColumn = Math.max(
          0,
          Math.floor((pulse.x - ringRadius - band - offsetX) / config.cellSize),
        );
        const maxColumn = Math.min(
          columns - 1,
          Math.floor((pulse.x + ringRadius + band - offsetX) / config.cellSize),
        );
        const minRow = Math.max(
          0,
          Math.floor((pulse.y - ringRadius - band - offsetY) / config.cellSize),
        );
        const maxRow = Math.min(
          rows - 1,
          Math.floor((pulse.y + ringRadius + band - offsetY) / config.cellSize),
        );

        for (let row = minRow; row <= maxRow; row += 1) {
          for (let column = minColumn; column <= maxColumn; column += 1) {
            const index = row * columns + column;
            const [centerX, centerY] = getCellCenter(index);
            const distance = Math.hypot(centerX - pulse.x, centerY - pulse.y);
            if (
              Math.abs(distance - ringRadius) < band / 2 &&
              config.maxOpacity > (alphas[index] ?? 0)
            ) {
              alphas[index] = config.maxOpacity;
              touched[index] = now;
            }
          }
        }
      }

      let hasVisibleCells = pulses.length > 0;
      const fadeStep = delta / Math.max(config.fadeDuration, 16);
      const halfCell = config.cellSize / 2;

      for (let index = 0; index < alphas.length; index += 1) {
        let alpha = alphas[index] ?? 0;
        if (alpha <= 0) continue;
        if (now - (touched[index] ?? 0) > config.holdTime) {
          alpha = Math.max(0, alpha - fadeStep);
          alphas[index] = alpha;
          if (alpha <= 0) continue;
        }

        hasVisibleCells = true;
        const [centerX, centerY] = getCellCenter(index);
        const gradient = context.createRadialGradient(
          centerX,
          centerY,
          halfCell * 0.1,
          centerX,
          centerY,
          config.cellSize,
        );
        gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

        const x = centerX - halfCell + 0.5;
        const y = centerY - halfCell + 0.5;
        const size = config.cellSize - 1;
        context.beginPath();
        if (config.cellRadius > 0) {
          context.roundRect(x, y, size, size, config.cellRadius);
        } else {
          context.rect(x, y, size, size);
        }
        if (config.fillOpacity > 0) {
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * config.fillOpacity})`;
          context.fill();
        }
        context.strokeStyle = gradient;
        context.lineWidth = config.lineWidth;
        context.stroke();
      }

      if (hasVisibleCells) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        running = false;
        if (propsRef.current.gridOpacity <= 0) {
          context.clearRect(0, 0, width, height);
        }
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(draw);
    };
    wakeRef.current = wake;

    const toLocal = (event: PointerEvent): [number, number] => {
      const bounds = canvas.getBoundingClientRect();
      return [event.clientX - bounds.left, event.clientY - bounds.top];
    };

    const handlePointerMove = (event: PointerEvent) => {
      const [x, y] = toLocal(event);
      energize(x, y);
      wake();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!propsRef.current.clickPulse) return;
      const [x, y] = toLocal(event);
      pulses.push({ x, y, startedAt: performance.now() });
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      wake();
    });
    resizeObserver.observe(container);
    rebuild();
    wake();
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerdown", handlePointerDown);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [cellSize]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
