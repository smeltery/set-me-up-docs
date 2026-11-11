"use client";
// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The overflow region must be keyboard-scrollable on narrow screens.
import { useId } from "react";
interface Diagram {
  title: string;
  actors: string[];
  steps: [number, number, string][];
  caption: string;
}

export function SetupDiagram({ diagram }: { diagram: Diagram }) {
  const id = useId().replaceAll(":", "");
  const stepSpacing = 46;
  const height = 104 + diagram.steps.length * stepSpacing;
  const width = Math.max(3, diagram.actors.length) * 240;
  return (
    <figure className="sequence-figure">
      <section
        className="sequence-scroll"
        tabIndex={0}
        aria-label={`Scrollable ${diagram.title}`}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title id={`${id}-title`}>{diagram.title}</title>
          <desc id={`${id}-desc`}>
            {diagram.steps
              .map(
                ([from, to, label]) =>
                  `${diagram.actors[from]} to ${diagram.actors[to]}: ${label}`
              )
              .join(". ")}
          </desc>
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10Z" fill="var(--accent-mid)" />
            </marker>
          </defs>
          {diagram.actors.map((actor, index) => (
            <g key={actor}>
              <rect
                x={40 + index * 240}
                y="15"
                width="160"
                height="45"
                rx="7"
                fill="var(--accent-soft)"
                stroke="var(--accent-border)"
              />
              <text x={120 + index * 240} y="43" textAnchor="middle">
                {actor}
              </text>
              <line
                x1={120 + index * 240}
                x2={120 + index * 240}
                y1="60"
                y2={height - 20}
                stroke="var(--accent-border)"
                strokeDasharray="4 5"
              />
            </g>
          ))}
          {diagram.steps.map(([from, to, label], index) => {
            const x1 = 120 + from * 240,
              x2 = 120 + to * 240,
              y = 95 + index * stepSpacing;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: steps are ordered and labels may repeat.
              <g key={index}>
                <text
                  x={from === to ? x1 + 10 : (x1 + x2) / 2}
                  y={y - 10}
                  textAnchor={from === to ? "start" : "middle"}
                >
                  {label}
                </text>
                <path
                  d={
                    from === to
                      ? `M${x1} ${y}h130v18h-130`
                      : `M${x1} ${y}H${x2}`
                  }
                  fill="none"
                  stroke="var(--accent-mid)"
                  strokeDasharray={to < from ? "5 4" : undefined}
                  markerEnd={`url(#${id}-arrow)`}
                />
              </g>
            );
          })}
        </svg>
      </section>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}
