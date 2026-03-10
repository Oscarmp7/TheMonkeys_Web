"use client";

import { motion } from "framer-motion";

interface Shape {
  type: "circle" | "square" | "triangle" | "hexagon";
  size: number;
  x: string;
  y: string;
  color: string;
  opacity: number;
  duration: number;
  delay: number;
  rotation: number;
}

const shapes: Shape[] = [
  {
    type: "circle",
    size: 80,
    x: "10%",
    y: "15%",
    color: "#FFCD00",
    opacity: 0.25,
    duration: 6,
    delay: 0,
    rotation: 0,
  },
  {
    type: "square",
    size: 60,
    x: "70%",
    y: "10%",
    color: "#00263E",
    opacity: 0.15,
    duration: 5,
    delay: 1,
    rotation: 45,
  },
  {
    type: "triangle",
    size: 100,
    x: "50%",
    y: "60%",
    color: "#FFCD00",
    opacity: 0.2,
    duration: 7,
    delay: 0.5,
    rotation: 15,
  },
  {
    type: "hexagon",
    size: 70,
    x: "80%",
    y: "50%",
    color: "#00263E",
    opacity: 0.2,
    duration: 4,
    delay: 2,
    rotation: 30,
  },
  {
    type: "circle",
    size: 40,
    x: "30%",
    y: "80%",
    color: "#00263E",
    opacity: 0.3,
    duration: 5.5,
    delay: 1.5,
    rotation: 0,
  },
  {
    type: "square",
    size: 120,
    x: "20%",
    y: "45%",
    color: "#FFCD00",
    opacity: 0.1,
    duration: 8,
    delay: 0.8,
    rotation: 20,
  },
  {
    type: "triangle",
    size: 50,
    x: "65%",
    y: "75%",
    color: "#FFCD00",
    opacity: 0.35,
    duration: 3.5,
    delay: 1.2,
    rotation: -10,
  },
];

function ShapeRenderer({ shape }: { shape: Shape }) {
  const { type, size, color, opacity } = shape;

  if (type === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill={color} opacity={opacity} />
      </svg>
    );
  }

  if (type === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" rx="8" fill={color} opacity={opacity} />
      </svg>
    );
  }

  if (type === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,10 90,90 10,90" fill={color} opacity={opacity} />
      </svg>
    );
  }

  // hexagon
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points="50,5 93,25 93,75 50,95 7,75 7,25"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 hidden md:block">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [shape.rotation, shape.rotation + 15, shape.rotation],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <ShapeRenderer shape={shape} />
        </motion.div>
      ))}
    </div>
  );
}
