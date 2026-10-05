import type { Dictionary } from '@/i18n/dictionaries/ru';
import type { Locale } from '@/i18n/config';
import { BLOCKS } from '@/data/project';
import type { UnitStatus, ViewKind, FinishKind } from '@/data/apartments';

/**
 * Compact label bundles for client components.
 *
 * Why not pass the whole dictionary: it is ~30 KB of text. Sending it to a
 * client component would put the entire site copy of all three languages into
 * the RSC payload of every page. These builders pick only the strings a given
 * interactive component actually renders.
 */

export interface ApartmentCardLabels {
  apartment: string;
  roomSuffix: string;
  room: string;
  area: string;
  floor: string;
  floorShort: string;
  ceiling: string;
  meters: string;
  pricePerSqm: string;
  learnMore: string;
  getTerms: string;
  stateProgram: string;
  statuses: Record<UnitStatus, string>;
  views: Record<ViewKind, string>;
  finishes: Record<FinishKind, string>;
  openApartment: string;
  blockNames: Record<string, string>;
  blockFloors: Record<string, number>;
}

export function buildApartmentCardLabels(locale: Locale, dict: Dictionary): ApartmentCardLabels {
  return {
    apartment: dict.apartments.detail.title,
    roomSuffix: dict.floorplans.room,
    room: dict.common.room,
    area: dict.common.area,
    floor: dict.common.floor,
    floorShort: dict.common.floorShort,
    ceiling: dict.common.ceiling,
    meters: locale === 'en' ? 'm' : 'м',
    pricePerSqm: dict.apartments.card.pricePerSqm,
    learnMore: dict.common.learnMore,
    getTerms: dict.cta.getApartmentTerms,
    stateProgram: dict.apartments.filters.stateProgram,
    statuses: dict.apartments.statuses,
    views: dict.apartments.views,
    finishes: dict.apartments.finishes,
    openApartment: dict.a11y.openApartment,
    blockNames: Object.fromEntries(BLOCKS.map((b) => [b.id, b.names[locale]])),
    blockFloors: Object.fromEntries(BLOCKS.map((b) => [b.id, b.floors])),
  };
}

export interface ExplorerLabels extends ApartmentCardLabels {
  card: ApartmentCardLabels;
  eyebrow: string;
  title: string;
  lead: string;
  filters: Dictionary['apartments']['filters'];
  resultsFound: string;
  resultsUnit: string;
  resultsFoundOne: string;
  resultsUnitOne: string;
  emptyTitle: string;
  emptyText: string;
  reset: string;
  any: string;
  all: string;
  min: string;
  max: string;
  sortDefault: string;
  choose: string;
  noResultsCta: string;
  resultStatusLabel: string;
  comingSoonNote: string;
  viewAll: string;
  filterToggle: string;
}

export interface UnitGridLabels {
  title: string;
  lead: string;
  block: string;
  unitsOnFloor: string;
  legend: string;
  legendAvailable: string;
  legendReserved: string;
  legendSold: string;
  selectHint: string;
  hint: string;
  tableCaption: string;
  selectedUnit: string;
  closeSelection: string;
  openUnit: string;
  card: ApartmentCardLabels;
}

export function buildUnitGridLabels(locale: Locale, dict: Dictionary): UnitGridLabels {
  return {
    title: dict.selector.title,
    lead: dict.selector.lead,
    block: dict.selector.block,
    unitsOnFloor: dict.selector.unitsOnFloor,
    legend: dict.selector.legend,
    legendAvailable: dict.selector.legendAvailable,
    legendReserved: dict.selector.legendReserved,
    legendSold: dict.selector.legendSold,
    selectHint: dict.selector.selectFloorHint,
    hint: dict.selector.hint,
    tableCaption: dict.a11y.legend,
    selectedUnit: dict.apartments.detail.title,
    closeSelection: dict.common.close,
    openUnit: dict.common.learnMore,
    card: buildApartmentCardLabels(locale, dict),
  };
}

export interface FloorPlansLabels {
  eyebrow: string;
  title: string;
  lead: string;
  tabsLabel: string;
  plan: string;
  roomSuffix: string;
  roomsCount: string;
  areaRange: string;
  floorsAvailable: string;
  priceFrom: string;
  availableCount: string;
  modal: Dictionary['floorplans']['modal'];
  resetZoom: string;
  zoomIn: string;
  zoomOut: string;
  area: string;
  totalArea: string;
  getPlan: string;
  bookCta: string;
  roomLabels: Record<string, string>;
}

export function buildFloorPlansLabels(locale: Locale, dict: Dictionary): FloorPlansLabels {
  return {
    eyebrow: dict.floorplans.eyebrow,
    title: dict.floorplans.title,
    lead: dict.floorplans.lead,
    tabsLabel: dict.floorplans.tabsLabel,
    plan: dict.floorplans.plan,
    roomSuffix: dict.floorplans.room,
    roomsCount: dict.floorplans.roomsCount,
    areaRange: dict.floorplans.areaRange,
    floorsAvailable: dict.floorplans.floorsAvailable,
    priceFrom: dict.floorplans.priceFrom,
    availableCount: dict.floorplans.availableCount,
    modal: dict.floorplans.modal,
    resetZoom: dict.floorplans.modal.resetZoom,
    zoomIn: dict.common.zoomIn,
    zoomOut: dict.common.zoomOut,
    area: dict.common.area,
    totalArea: dict.plan.totalArea,
    getPlan: dict.cta.getPlanPdf,
    bookCta: dict.cta.getApartmentTerms,
    roomLabels: dict.floorplans.roomLabels,
  };
}

export interface MortgageLabels {
  eyebrow: string;
  title: string;
  lead: string;
  calculator: Dictionary['mortgage']['calculator'];
  tableTitle: string;
  tableNote: string;
  disclaimerTitle: string;
  disclaimer: string;
  ctaNote: string;
  consultCta: string;
  rateLabel: string;
  downLabel: string;
  termLabel: string;
  capLabel: string;
  providerLabel: string;
  periodLabel: string;
  sourcesTitle: string;
  caveatLabel: string;
  showAll: string;
  hideAll: string;
}

export function buildMortgageLabels(dict: Dictionary): MortgageLabels {
  return {
    eyebrow: dict.mortgage.eyebrow,
    title: dict.mortgage.title,
    lead: dict.mortgage.lead,
    calculator: dict.mortgage.calculator,
    tableTitle: dict.mortgage.tableTitle,
    tableNote: dict.mortgage.tableNote,
    disclaimerTitle: dict.mortgage.disclaimerTitle,
    disclaimer: dict.mortgage.disclaimer,
    ctaNote: dict.mortgage.ctaNote,
    consultCta: dict.cta.getConsultation,
    rateLabel: dict.mortgage.calculator.rate,
    downLabel: dict.mortgage.calculator.down,
    termLabel: dict.mortgage.calculator.term,
    capLabel: dict.common.price,
    providerLabel: dict.contacts.salesOffice,
    periodLabel: dict.common.minutes,
    sourcesTitle: dict.documents.eyebrow,
    caveatLabel: dict.common.demoData,
    showAll: dict.common.more,
    hideAll: dict.common.less,
  };
}

export interface ConstructionLabels {
  eyebrow: string;
  title: string;
  lead: string;
  filterAll: string;
  progress: string;
  worksDone: string;
  nextWorks: string;
  reportDate: string;
  cameraTitle: string;
  cameraText: string;
  blockNames: Record<string, string>;
  overallLabel: string;
  updatedLabel: string;
}

export function buildConstructionLabels(locale: Locale, dict: Dictionary): ConstructionLabels {
  return {
    eyebrow: dict.construction.eyebrow,
    title: dict.construction.title,
    lead: dict.construction.lead,
    filterAll: dict.construction.filterAll,
    progress: dict.construction.progress,
    worksDone: dict.construction.worksDone,
    nextWorks: dict.construction.nextWorks,
    reportDate: dict.construction.reportDate,
    cameraTitle: dict.construction.cameraTitle,
    cameraText: dict.construction.cameraText,
    blockNames: Object.fromEntries(BLOCKS.map((b) => [b.id, b.names[locale]])),
    overallLabel: dict.construction.totalProgress,
    updatedLabel: dict.common.updated,
  };
}

export function buildExplorerLabels(locale: Locale, dict: Dictionary): ExplorerLabels {
  const card = buildApartmentCardLabels(locale, dict);
  return {
    ...card,
    card,
    eyebrow: dict.apartments.eyebrow,
    title: dict.apartments.title,
    lead: dict.apartments.lead,
    filters: dict.apartments.filters,
    resultsFound: dict.apartments.resultsFound,
    resultsUnit: dict.apartments.resultsUnit,
    resultsFoundOne: dict.apartments.resultsFoundOne,
    resultsUnitOne: dict.apartments.resultsUnitOne,
    emptyTitle: dict.apartments.emptyTitle,
    emptyText: dict.apartments.emptyText,
    reset: dict.common.reset,
    any: dict.common.any,
    all: dict.common.all,
    min: dict.common.min,
    max: dict.common.max,
    sortDefault: dict.apartments.filters.sort,
    choose: dict.cta.chooseApartment,
    noResultsCta: dict.cta.getConsultation,
    resultStatusLabel: dict.a11y.filterResults,
    comingSoonNote: dict.apartments.filters.applyHint,
    viewAll: dict.common.viewAll,
    filterToggle: dict.apartments.filters.open,
  };
}
