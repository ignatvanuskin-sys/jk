import { cn } from '@/lib/cn';

/**
 * Only the geometry is required to draw a plan. Keeping this interface minimal
 * means the drawing can be rendered from the server data model *and* from the
 * compact projection sent to the client plan viewer, without duplicating the
 * renderer or shipping the whole data model to the browser.
 */
export interface PlanGeometry {
  envelope: { w: number; h: number };
  layout: {
    key: string;
    x: number;
    y: number;
    w: number;
    h: number;
    outside?: boolean;
  }[];
}

/** Drawing units per metre. 44 keeps lines crisp at every rendered size. */
const S = 44;

const FILLS: Record<string, string> = {
  living: '#efe9de',
  bedroom: '#efe9de',
  bedroom2: '#efe9de',
  bedroom3: '#efe9de',
  kitchen: '#e6dfd1',
  bathroom: '#dde4de',
  bathroom2: '#dde4de',
  hall: '#f4f1ea',
  corridor: '#f4f1ea',
  storage: '#ebe5da',
  laundry: '#ebe5da',
  balcony: '#f2eee6',
};

function fillFor(key: string): string {
  return FILLS[key] ?? '#f1ece3';
}

interface FloorPlanSvgProps {
  plan: PlanGeometry;
  /** Room names, already localised. */
  roomLabels: Record<string, string>;
  variant?: 'thumb' | 'detail';
  className?: string;
  /** Accessible label — required for `detail`, ignored for `thumb`. */
  title?: string;
  description?: string;
}

/**
 * Floor plan renderer.
 *
 * The plans are drawn from the same geometry that produces the areas shown in
 * the catalogue, so a plan can never contradict the numbers next to it. Being
 * vector, they stay sharp at any zoom level — which is exactly what the plan
 * viewer in the modal needs, and it removes the need to ship plan images at all.
 */
export function FloorPlanSvg({
  plan,
  roomLabels,
  variant = 'detail',
  className,
  title,
  description,
}: FloorPlanSvgProps) {
  const detailed = variant === 'detail';

  const maxX = Math.max(...plan.layout.map((r) => r.x + r.w));
  const maxY = Math.max(...plan.layout.map((r) => r.y + r.h));
  const pad = detailed ? 8 : 5;

  const width = (maxX + pad * 2) * S;
  const height = (maxY + pad * 2) * S;

  return (
    <svg
      viewBox={`${-pad * S} ${-pad * S} ${width} ${height}`}
      className={cn('h-auto w-full', className)}
      role={detailed ? 'img' : 'presentation'}
      aria-label={detailed ? title : undefined}
      aria-hidden={detailed ? undefined : true}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {detailed && title && <title>{title}</title>}
      {detailed && description && <desc>{description}</desc>}

      {/* Interior walls */}
      {plan.layout.map((room) => (
        <rect
          key={`${room.key}-${room.x}-${room.y}-${room.w}`}
          x={room.x * S}
          y={room.y * S}
          width={room.w * S}
          height={room.h * S}
          fill={fillFor(room.key)}
          stroke={room.outside ? '#b9ae9c' : '#4a4b44'}
          strokeWidth={room.outside ? 1.2 : 1.6}
          strokeDasharray={room.outside ? '6 4' : undefined}
        />
      ))}

      {/* Load-bearing envelope, drawn last so it sits on top */}
      <rect
        x={0}
        y={0}
        width={plan.envelope.w * S}
        height={plan.envelope.h * S}
        fill="none"
        stroke="#191a17"
        strokeWidth={detailed ? 3.4 : 3}
      />

      {detailed &&
        plan.layout
          .filter((room) => !room.outside && room.w * room.h >= 3.4)
          .map((room) => {
            const cx = (room.x + room.w / 2) * S;
            const cy = (room.y + room.h / 2) * S;
            const label = roomLabels[room.key] ?? room.key;
            const area = Math.round(room.w * room.h * 10) / 10;
            return (
              <g key={`label-${room.key}-${room.x}-${room.y}`}>
                <text
                  x={cx}
                  y={cy - 3}
                  textAnchor="middle"
                  fontSize={12.5}
                  fontWeight={600}
                  fill="#191a17"
                >
                  {label}
                </text>
                <text x={cx} y={cy + 13} textAnchor="middle" fontSize={11.5} fill="#6d6e66">
                  {area.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} м²
                </text>
              </g>
            );
          })}

      {/* Balcony label sits outside the envelope */}
      {detailed &&
        plan.layout
          .filter((room) => room.outside)
          .map((room) => (
            <text
              key={`bal-${room.x}`}
              x={(room.x + room.w / 2) * S}
              y={(room.y + room.h / 2) * S + 4}
              textAnchor="middle"
              fontSize={11}
              fill="#6d6e66"
            >
              {roomLabels[room.key] ?? room.key}
            </text>
          ))}

      {/* Scale bar — 1 metre, so the drawing carries its own reference */}
      {detailed && (
        <g transform={`translate(${-pad * S + 6} ${(maxY + pad) * S - 10})`}>
          <line x1={0} y1={0} x2={S} y2={0} stroke="#191a17" strokeWidth={2} />
          <line x1={0} y1={-4} x2={0} y2={4} stroke="#191a17" strokeWidth={2} />
          <line x1={S} y1={-4} x2={S} y2={4} stroke="#191a17" strokeWidth={2} />
          <text x={S / 2} y={-7} textAnchor="middle" fontSize={10} fill="#6d6e66">
            1 м
          </text>
        </g>
      )}
    </svg>
  );
}
