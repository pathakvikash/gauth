'use client';

import { useId, type SVGProps } from 'react';
import type { PatternIconKey } from '@/lib/vault/defaultImages';

type IconProps = SVGProps<SVGSVGElement>;

function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path d="M24 4l6.18 12.52L44 18.5l-10 9.75L36.36 42 24 35.25 11.64 42 14 28.25 4 18.5l13.82-2.02L24 4z" />
    </svg>
  );
}

function MoonIcon(props: IconProps) {
  const maskId = useId();
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <mask id={maskId}>
        <rect width="48" height="48" fill="white" />
        <circle cx="30" cy="16" r="13" fill="black" />
      </mask>
      <circle cx="22" cy="24" r="18" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}

function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" {...props}>
      <circle cx="24" cy="24" r="9" fill="currentColor" stroke="none" />
      <g strokeWidth="3" strokeLinecap="round">
        <line x1="24" y1="2" x2="24" y2="9" />
        <line x1="24" y1="39" x2="24" y2="46" />
        <line x1="2" y1="24" x2="9" y2="24" />
        <line x1="39" y1="24" x2="46" y2="24" />
        <line x1="8" y1="8" x2="13" y2="13" />
        <line x1="35" y1="35" x2="40" y2="40" />
        <line x1="40" y1="8" x2="35" y2="13" />
        <line x1="13" y1="35" x2="8" y2="40" />
      </g>
    </svg>
  );
}

function BoltIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path d="M28 2 8 26h9l-3 20 22-26h-10l2-18z" />
    </svg>
  );
}

function DiamondIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path d="M24 4 44 24 24 44 4 24 24 4z" />
    </svg>
  );
}

function HexIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
      <path d="M24 3 42 13.5v21L24 45 6 34.5v-21L24 3z" />
    </svg>
  );
}

export const PATTERN_ICONS: Record<PatternIconKey, (props: IconProps) => JSX.Element> = {
  star: StarIcon,
  moon: MoonIcon,
  sun: SunIcon,
  bolt: BoltIcon,
  diamond: DiamondIcon,
  hex: HexIcon,
};

export function PatternIcon({ iconKey, className }: { iconKey: PatternIconKey; className?: string }) {
  const Icon = PATTERN_ICONS[iconKey];
  return <Icon className={className} />;
}
