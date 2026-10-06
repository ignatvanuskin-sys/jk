'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { formatArea, formatNumber, formatPrice } from '@/i18n/config';
import type { PlanSummary } from '@/data/plan-summaries';
import { planContext } from '@/lib/contacts';
import { cn } from '@/lib/cn';

import { FloorPlanSvg } from './FloorPlanSvg';
import { Modal } from '@/components/ui/Modal';
import { LeadButton } from '@/components/forms/LeadButton';
import type { FloorPlansLabels } from '@/components/apartments/labels';

const ROOM_TABS = [1, 2, 3, 4] as const;
const ZOOM_STEPS = [1, 1.5, 2, 2.75] as const;

/**
 * Floor-plan section: tabs by room count, a card per layout, and a full-size
 * viewer.
 *
 * The viewer zooms by *resizing the drawing* inside a scroll container rather
 * than by applying a CSS transform. That keeps stroke widths and label sizes
 * crisp at every zoom level and lets a phone user pan with a finger, which is
 * how the majority of visitors will actually look at a plan.
 */
export function FloorPlansExplorer({
  plans,
  locale,
  labels,
}: {
  plans: PlanSummary[];
  locale: Locale;
  labels: FloorPlansLabels;
}) {
  const [rooms, setRooms] = useState<(typeof ROOM_TABS)[number]>(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const closeRef = useRef<HTMLElement | null>(null);

  const visiblePlans = plans.filter((plan) => plan.rooms === rooms);
  const active = activeId ? (plans.find((plan) => plan.id === activeId) ?? null) : null;

  // Reset the zoom each time a different plan is opened.
  useEffect(() => setZoomIndex(0), [activeId]);

  return (
    <div>
      <div
        role="group"
        aria-label={labels.tabsLabel}
        className="scroll-x flex gap-1.5 border-b border-line pb-px"
      >
        {ROOM_TABS.map((value) => {
          const activeTab = value === rooms;
          const count = plans.filter((plan) => plan.rooms === value).length;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={activeTab}
              onClick={() => setRooms(value)}
              className={cn(
                'relative flex-none rounded-t-xs px-4 py-3 text-sm transition-colors',
                activeTab
                  ? 'bg-ink text-paper'
                  : 'text-ink-soft hover:bg-bone hover:text-ink',
              )}
            >
              {value === 4 ? '4+' : value} {labels.roomSuffix}
              <span className="ml-2 text-[0.625rem] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visiblePlans.map((plan) => (
          <li key={plan.id}>
            <article className="card card-hover flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[4/3] border-b border-line-soft bg-bone/40">
                <div className="absolute inset-0 flex items-center justify-center p-5">
                  <FloorPlanSvg
                    plan={plan}
                    roomLabels={labels.roomLabels}
                    variant="thumb"
                    className="max-h-full"
                  />
                </div>
                <p className="absolute left-3 top-3 rounded-xs border border-line bg-paper/95 px-2 py-1 text-[0.6875rem] font-medium text-ink">
                  {labels.plan} {plan.id}
                </p>
                {plan.available > 0 && (
                  <p className="absolute right-3 top-3 rounded-xs bg-ok/12 px-2 py-1 text-[0.6875rem] font-medium text-ok">
                    {labels.availableCount}: {plan.available}
                  </p>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-2xl leading-none text-ink">
                  {plan.name[locale]}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  {plan.rooms}-{labels.roomSuffix} · {formatArea(plan.totalArea, locale)}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line-soft pt-4 text-xs">
                  <div>
                    <dt className="text-muted">{labels.areaRange}</dt>
                    <dd className="num mt-1 font-medium text-ink">
                      {formatArea(plan.livingArea, locale)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted">{labels.floorsAvailable}</dt>
                    <dd className="num mt-1 font-medium text-ink">
                      {plan.floors.length
                        ? `${plan.floors[0]}–${plan.floors[plan.floors.length - 1]}`
                        : '—'}
                    </dd>
                  </div>
                </dl>

                <p className="num mt-4 font-display text-2xl leading-none text-ink">
                  {labels.priceFrom} {formatPrice(plan.priceFrom, locale)}
                </p>

                <div className="mt-auto flex flex-col gap-2 pt-5">
                  <button
                    type="button"
                    onClick={() => setActiveId(plan.id)}
                    className="btn btn-outline w-full"
                  >
                    {labels.plan}: {plan.id}
                  </button>
                  <LeadButton
                    source={`floorplan-card:${plan.id}`}
                    subject={planContext(locale, plan.id, plan.totalArea)}
                    variant="primary"
                    fullWidth
                  >
                    {labels.getPlan}
                  </LeadButton>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* closeLabel is the modal action, not the modal title: a close button
          whose accessible name is "Планировка" tells a screen-reader user
          nothing about what it does. */}
      <Modal
        open={active !== null}
        onClose={() => setActiveId(null)}
        labelledBy="plan-modal-title"
        closeLabel={labels.modal.close}
        size="xl"
        panelClassName="bg-paper"
        initialFocusRef={closeRef}
      >
        {active && (
          <div className="flex max-h-[94dvh] flex-col">
            <header className="flex flex-none flex-wrap items-end justify-between gap-4 border-b border-line px-6 py-5 pr-16">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                  {labels.modal.title}
                </p>
                <h2 id="plan-modal-title" className="mt-2 font-display text-3xl leading-none text-ink">
                  {active.name[locale]} · {active.id}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">
                  {active.rooms}-{labels.roomSuffix} · {formatArea(active.totalArea, locale)} ·{' '}
                  {active.bathrooms} · {active.balconies} {labels.modal.roomsList.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-2" data-print-hide>
                <span className="text-xs text-muted">{labels.modal.zoomHint}</span>
                <button
                  type="button"
                  onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
                  disabled={zoomIndex === 0}
                  aria-label={labels.zoomOut}
                  className="flex size-11 items-center justify-center rounded-xs border border-line bg-white disabled:opacity-40"
                >
                  −
                </button>
                <span className="num w-12 text-center text-xs text-ink-soft">
                  {ZOOM_STEPS[zoomIndex].toFixed(2).replace('.', ',')}×
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setZoomIndex((index) => Math.min(ZOOM_STEPS.length - 1, index + 1))
                  }
                  disabled={zoomIndex === ZOOM_STEPS.length - 1}
                  aria-label={labels.zoomIn}
                  className="flex size-11 items-center justify-center rounded-xs border border-line bg-white disabled:opacity-40"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomIndex(0)}
                  className="ml-1 text-xs text-clay underline decoration-clay/40 underline-offset-4"
                >
                  {labels.resetZoom}
                </button>
              </div>
            </header>

            <div className="grid flex-1 overflow-hidden lg:grid-cols-[1.6fr_1fr]">
              <div className="scroll-x overflow-auto border-b border-line bg-bone/40 p-6 lg:border-b-0 lg:border-r">
                <div style={{ width: `${ZOOM_STEPS[zoomIndex] * 100}%` }} className="min-w-full">
                  <FloorPlanSvg
                    plan={active}
                    roomLabels={labels.roomLabels}
                    variant="detail"
                    title={`${labels.modal.title} ${active.id}`}
                    description={`${active.rooms}-${labels.roomSuffix}, ${active.totalArea} m²`}
                  />
                </div>
                <p className="mt-4 text-xs text-muted">{labels.modal.hint}</p>
              </div>

              <div className="overflow-y-auto p-6">
                <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-clay">
                  {labels.modal.dimensions}
                </h3>
                <table className="mt-4 w-full text-sm">
                  <tbody className="divide-y divide-line-soft">
                    {active.layout
                      .filter((room) => !room.outside && room.w * room.h > 0)
                      .map((room) => (
                        <tr key={`${room.key}-${room.x}-${room.y}`}>
                          <th scope="row" className="py-2.5 text-left font-normal text-ink-soft">
                            {labels.roomLabels[room.key] ?? room.key}
                          </th>
                          <td className="num py-2.5 text-right text-muted">
                            {room.w.toFixed(1).replace('.', ',')} ×{' '}
                            {room.h.toFixed(1).replace('.', ',')} м
                          </td>
                          <td className="num py-2.5 pr-0 pl-4 text-right text-ink">
                            {(room.w * room.h).toFixed(1).replace('.', ',')} м²
                          </td>
                        </tr>
                      ))}
                    {active.balconies > 0 &&
                      active.layout
                        .filter((room) => room.outside)
                        .map((room) => (
                          <tr key={`bal-${room.x}`}>
                            <th scope="row" className="py-2.5 text-left font-normal text-ink-soft">
                              {labels.roomLabels[room.key] ?? room.key}
                            </th>
                            <td className="num py-2.5 text-right text-muted">
                              {room.w.toFixed(1).replace('.', ',')} ×{' '}
                              {room.h.toFixed(1).replace('.', ',')} м
                            </td>
                            <td className="num py-2.5 pr-0 pl-4 text-right text-ink">
                              {(room.w * room.h).toFixed(1).replace('.', ',')} м²
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>

                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
                  <div>
                    <dt className="text-xs text-muted">{labels.totalArea}</dt>
                    <dd className="num mt-1 font-display text-xl text-ink">
                      {formatArea(active.totalArea, locale)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">{labels.area}</dt>
                    <dd className="num mt-1 font-display text-xl text-ink">
                      {formatArea(active.livingArea, locale)}
                    </dd>
                  </div>
                </dl>

                <p className="num mt-6 border-t border-line pt-5 font-display text-3xl leading-none text-ink">
                  {formatPrice(active.priceFrom, locale)}
                </p>
                <p className="num mt-1 text-xs text-muted">
                  {formatNumber(Math.round(active.priceFrom / Math.max(active.totalArea, 1)), locale)} ₸
                  {' / м²'}
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <LeadButton
                    source={`floorplan-modal:${active.id}`}
                    subject={planContext(locale, active.id, active.totalArea)}
                    variant="primary"
                    fullWidth
                  >
                    {labels.getPlan}
                  </LeadButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
