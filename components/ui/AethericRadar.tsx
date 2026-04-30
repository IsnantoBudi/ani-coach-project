"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stats } from "@/types";

interface AethericRadarProps {
  stats: Stats;
  size?: number;
  showLabels?: boolean;
}

export default function AethericRadar({ stats, size = 160, showLabels = false }: AethericRadarProps) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  // Stats order: STR, INT, VIT, AGI, CHR
  const statValues = [
    { label: "STR", val: stats.str, color: "#f43f5e" },
    { label: "INT", val: stats.int, color: "#06b6d4" },
    { label: "VIT", val: stats.vit, color: "#10b981" },
    { label: "AGI", val: stats.agi, color: "#f59e0b" },
    { label: "CHR", val: stats.chr, color: "#8b5cf6" },
  ];

  // Radar math constants
  const centerX = 50;
  const centerY = 50;
  const maxRadius = showLabels ? 35 : 42; // Reduced to avoid label overlap
  const angles = [-90, -18, 54, 126, 198]; // Pentagon vertices angles in degrees

  const getPoints = (values: number[], radius: number) => {
    return values.map((v, i) => {
      const r = (v / 100) * radius;
      const rad = (angles[i] * Math.PI) / 180;
      return `${centerX + r * Math.cos(rad)},${centerY + r * Math.sin(rad)}`;
    }).join(" ");
  };

  const actualPoints = getPoints(statValues.map(s => s.val), maxRadius);
  const gridPoints1 = getPoints([100, 100, 100, 100, 100], maxRadius);
  const gridPoints2 = getPoints([100, 100, 100, 100, 100], maxRadius * 0.66);
  const gridPoints3 = getPoints([100, 100, 100, 100, 100], maxRadius * 0.33);

  return (
    <div className="relative group flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full drop-shadow-sm overflow-visible pt-2" viewBox="0 0 100 100">
        {/* Background Grids */}
        <polygon points={gridPoints1} fill="none" stroke="rgba(114,120,120,0.1)" strokeWidth="0.5" />
        <polygon points={gridPoints2} fill="none" stroke="rgba(114,120,120,0.1)" strokeWidth="0.5" />
        <polygon points={gridPoints3} fill="none" stroke="rgba(114,120,120,0.1)" strokeWidth="0.5" />
        
        {/* Axis Lines */}
        {angles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line 
              key={i}
              x1={centerX} 
              y1={centerY} 
              x2={centerX + maxRadius * Math.cos(rad)} 
              y2={centerY + maxRadius * Math.sin(rad)} 
              stroke="rgba(114,120,120,0.15)" 
              strokeWidth="0.5"
            />
          );
        })}

        {/* Actual Stats Polygon */}
        <motion.polygon 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          points={actualPoints} 
          fill="rgba(81,97,97,0.2)" 
          stroke="rgba(81,97,97,0.7)" 
          strokeWidth="1.5" 
          strokeLinejoin="round"
          className="transition-all duration-300"
          style={{ filter: hoveredStat !== null ? "drop-shadow(0 0 2px rgba(81,97,97,0.3))" : "none" }}
        />

        {/* Stat Vertex Points & Labels */}
        {statValues.map((s, i) => {
          const r = (s.val / 100) * maxRadius;
          const rad = (angles[i] * Math.PI) / 180;
          const isHovered = hoveredStat === i;

          return (
            <g key={i} className="cursor-pointer">
              {/* Invisible trigger area */}
              <circle 
                cx={centerX + maxRadius * Math.cos(rad)} 
                cy={centerY + maxRadius * Math.sin(rad)} 
                r="15" 
                fill="transparent"
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
              />

              <motion.circle 
                initial={{ r: 1.5 }}
                animate={{ r: isHovered ? 2.5 : 1.5, fill: isHovered ? s.color : "#516161" }}
                cx={centerX + r * Math.cos(rad)} 
                cy={centerY + r * Math.sin(rad)} 
                fill="#516161" 
              />

              {showLabels && (
                <text
                  x={centerX + (maxRadius + 14) * Math.cos(rad)}
                  y={centerY + (maxRadius + 14) * Math.sin(rad)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[7px] font-heading font-bold transition-all duration-300 ${isHovered ? "fill-primary text-[9px]" : "fill-on-surface-variant opacity-60"}`}
                >
                  {isHovered ? `${s.label}: ${s.val}` : s.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Central Tooltip Overlay */}
      <AnimatePresence>
        {hoveredStat !== null && !showLabels && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-md border shadow-lg px-2 py-1 rounded-md filigree-border">
              <p className="text-[10px] font-heading font-bold text-primary">
                {statValues[hoveredStat].label}: <span className="text-secondary">{statValues[hoveredStat].val}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
