'use client';

interface GridPatternPadProps {
  size: 3 | 4;
  sequence: string[];
  onChange: (sequence: string[]) => void;
}

const SPACING = 70;
const PADDING = 36;

export function GridPatternPad({ size, sequence, onChange }: GridPatternPadProps) {
  const nodeCount = size * size;
  const nodes = Array.from({ length: nodeCount }, (_, i) => i);
  const dim = PADDING * 2 + SPACING * (size - 1);

  function nodePos(index: number) {
    const row = Math.floor(index / size);
    const col = index % size;
    return { x: PADDING + col * SPACING, y: PADDING + row * SPACING };
  }

  function handleNodeClick(index: number) {
    const id = String(index);
    if (sequence.includes(id)) return;
    onChange([...sequence, id]);
  }

  return (
    <div className="space-y-4">
      <svg width={dim} height={dim} className="mx-auto touch-none select-none">
        {sequence.slice(1).map((id, idx) => {
          const from = nodePos(Number(sequence[idx]));
          const to = nodePos(Number(id));
          return (
            <line
              key={`${sequence[idx]}-${id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#F1C376"
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
        {nodes.map((index) => {
          const pos = nodePos(index);
          const selected = sequence.includes(String(index));
          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r={14}
              className="cursor-pointer"
              fill={selected ? '#F1C376' : '#1c1c20'}
              stroke="#F1C376"
              strokeWidth={2}
              onClick={() => handleNodeClick(index)}
            />
          );
        })}
      </svg>
      <div className="flex gap-3 text-sm justify-center items-center">
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={sequence.length === 0}
          className="text-gold disabled:opacity-30"
        >
          Clear
        </button>
        <span className="text-white/60">
          {sequence.length}/{nodeCount} nodes
        </span>
      </div>
    </div>
  );
}
