'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/cn';

export type InfraCategoryKey =
  | 'education'
  | 'medicine'
  | 'shops'
  | 'malls'
  | 'parks'
  | 'sport'
  | 'cafes'
  | 'transport';

/** Localised object passed down from the server. */
export interface MapObject {
  id: string;
  category: InfraCategoryKey;
  label: string;
  minutes: number;
  mode: 'walk' | 'transport';
}

const CATEGORY_COLOUR: Record<InfraCategoryKey, string> = {
  education: '#2f6b4f',
  medicine: '#9c2f1e',
  shops: '#9a4318',
  malls: '#7a4a86',
  parks: '#3f7a4a',
  sport: '#1f5f7a',
  cafes: '#a8760f',
  transport: '#3b3c36',
};

/** Hand-set bearings so no two objects of the same category overlap. */
const ANGLES: Record<string, number> = {
  school: 200,
  kindergarten: 320,
  gymnasium: 155,
  'art-school': 118,
  polyclinic: 250,
  hospital: 275,
  pharmacy: 20,
  dentist: 40,
  supermarket: 340,
  minimarket: 300,
  market: 95,
  'mall-1': 310,
  'mall-2': 0,
  'park-city': 175,
  square: 130,
  embankment: 70,
  fitness: 45,
  pool: 220,
  stadium: 265,
  coffee: 285,
  restaurant: 330,
  bakery: 108,
  'bus-stop': 350,
  'brt-stop': 10,
  railway: 232,
};

const VIEW_W = 1000;
const VIEW_H = 700;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;

/**
 * The rings ARE the scale: the radius encodes walking time, so a dot can never
 * sit closer than its own minutes. Nothing here claims real geography — the
 * section says so in plain text right above the drawing.
 */
const radiusFor = (minutes: number) => 62 + (minutes - 1) * 14;

const RINGS = [5, 10, 15] as const;

/**
 * Schematic infrastructure map.
 *
 * Deliberately not an embedded third-party map: this build has no verified
 * coordinates, and plotting an invented pin on a real map would be a factual
 * claim. Instead the drawing shows what we actually know — how long it takes to
 * walk to each amenity type — and the accessible content is the list beside it,
 * not the picture.
 */
export function InfraMap({
  objects,
  categoryLabels,
  categoryOrder,
  mapLabel,
  listLabel,
  minutesLabel,
  walkLabel,
  transportLabel,
  allLabel,
  emptyLabel,
  objectsCountLabel,
}: {
  objects: MapObject[];
  categoryLabels: Record<InfraCategoryKey, string>;
  categoryOrder: InfraCategoryKey[];
  mapLabel: string;
  listLabel: string;
  minutesLabel: string;
  walkLabel: string;
  transportLabel: string;
  allLabel: string;
  emptyLabel: string;
  objectsCountLabel: string;
}) {
  const [category, setCategory] = useState<InfraCategoryKey | 'all'>('all');

  const visible = useMemo(
    () =>
      objects
        .filter((object) => category === 'all' || object.category === category)
        .slice()
        .sort((a, b) => a.minutes - b.minutes),
    [objects, category],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
      {/* min-w-0: without it the grid item's automatic minimum width becomes the
          chip rail's full content width, so the rail grew to ~730px inside a
          ~340px column instead of scrolling inside it — and on a phone the chips
          past the viewport became unreachable. */}
      <div className="min-w-0">
        <div className="scroll-x -mx-1 flex gap-1.5 px-1 pb-3">
          <button
            type="button"
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
            className={cn(
              'inline-flex min-h-11 flex-none items-center rounded-xs border px-3.5 text-xs transition-colors',
              category === 'all'
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-ink-soft hover:border-ink/40',
            )}
          >
            {allLabel}
          </button>
          {categoryOrder.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={category === key}
              onClick={() => setCategory(key)}
              className={cn(
                'inline-flex min-h-11 flex-none items-center rounded-xs border px-3.5 text-xs transition-colors',
                category === key
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-white text-ink-soft hover:border-ink/40',
              )}
            >
              <span
                className="mr-1.5 inline-block size-2 rounded-full align-middle"
                style={{ backgroundColor: CATEGORY_COLOUR[key] }}
                aria-hidden="true"
              />
              {categoryLabels[key]}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-bone">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={mapLabel}
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {/* Walking-time rings */}
            {RINGS.map((minutes) => (
              <g key={minutes}>
                <circle
                  cx={CX}
                  cy={CY}
                  r={radiusFor(minutes)}
                  fill="none"
                  stroke="#c4b9a7"
                  strokeWidth="1.5"
                  strokeDasharray="7 7"
                />
                <text
                  x={CX + radiusFor(minutes) - 4}
                  y={CY - 8}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6d6e66"
                >
                  {minutes} {minutesLabel}
                </text>
              </g>
            ))}

            {/* The complex itself */}
            <g>
              <rect
                x={CX - 62}
                y={CY - 40}
                width={124}
                height={80}
                rx="4"
                fill="#1f3d33"
              />
              <text
                x={CX}
                y={CY - 6}
                textAnchor="middle"
                fontSize="15"
                fontWeight="600"
                fill="#fbfaf7"
              >
                QONYS
              </text>
              <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fill="#c07a4e">
                RESIDENCE
              </text>
            </g>

            {/* Amenities */}
            {visible.map((object, index) => {
              const angle = ((ANGLES[object.id] ?? (index * 37) % 360) * Math.PI) / 180;
              const radius = radiusFor(object.minutes);
              const x = CX + Math.cos(angle) * radius;
              const y = CY + Math.sin(angle) * radius;
              const colour = CATEGORY_COLOUR[object.category];
              const isTransport = object.mode === 'transport';

              return (
                <g key={object.id}>
                  <line
                    x1={CX}
                    y1={CY}
                    x2={x}
                    y2={y}
                    stroke={colour}
                    strokeWidth="1"
                    opacity="0.28"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="15"
                    fill="#fbfaf7"
                    stroke={colour}
                    strokeWidth={isTransport ? 2.6 : 1.8}
                    strokeDasharray={isTransport ? '3 2.5' : undefined}
                  />
                  <text
                    x={x}
                    y={y + 4.5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="600"
                    fill={colour}
                  >
                    {object.minutes}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
            {listLabel}
          </h2>
          <p className="num text-xs text-muted">
            {visible.length} {objectsCountLabel}
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="mt-4 text-sm text-muted">{emptyLabel}</p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {visible.map((object) => (
              <li
                key={object.id}
                className="flex items-center justify-between gap-4 border-b border-line-soft pb-2.5 last:border-b-0"
              >
                <span className="flex items-center gap-2.5 text-sm text-ink">
                  <span
                    className="size-2.5 flex-none rounded-full"
                    style={{ backgroundColor: CATEGORY_COLOUR[object.category] }}
                    aria-hidden="true"
                  />
                  {object.label}
                </span>
                <span className="num flex-none text-xs text-ink-soft">
                  {object.minutes} {minutesLabel}
                  <span className="ml-1.5 text-muted">
                    {object.mode === 'walk' ? walkLabel : transportLabel}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
