/**
 * Image manifest.
 *
 * Every image on the site is registered here with:
 *   • the file in /public/images
 *   • alt text in all three locales (required for accessibility and image SEO)
 *
 * Intrinsic dimensions and blur placeholders are written by
 * `scripts/prepare-images.mjs` into `image-meta.ts`, so the layout reserves the
 * right space and CLS stays at zero.
 *
 * DATA SOURCE — all images are 3D visualisations generated for this
 * template. They are NOT photographs of a built development. The site states
 * this in the footer disclaimer.
 */

import type { Locale } from '@/i18n/config';
import { IMAGE_META, type ImageMeta } from './image-meta';

export type MediaKey =
  | 'hero-exterior'
  | 'night-facade'
  | 'aerial'
  | 'courtyard'
  | 'playground'
  | 'sport'
  | 'landscape'
  | 'facade-detail'
  | 'lobby'
  | 'interior-living'
  | 'parking'
  | 'commercial'
  | 'construction-frame'
  | 'construction-facade'
  | 'construction-yard'
  | 'og-cover';

interface MediaDefinition {
  src: string;
  alt: Record<Locale, string>;
  /** Layout hint for the <Image> element. */
  layout: 'full' | 'wide' | 'card';
}

export const MEDIA: Record<MediaKey, MediaDefinition> = {
  'hero-exterior': {
    src: '/images/hero-exterior.jpg',
    layout: 'full',
    alt: {
      ru: 'Главный фасад жилого комплекса вечером: пять секций переменной этажности, панорамное остекление, подсвеченные входные группы',
      kz: 'Тұрғын үй кешенінің басты қасбеті кешкі уақытта: қабаттылығы әртүрлі бес секция, панорамалық әйнектеу, жарықтандырылған кіреберістер',
      en: 'Main facade of the residential complex at dusk: five sections of varying height, full-height glazing, lit entrance groups',
    },
  },
  'night-facade': {
    src: '/images/night-facade.jpg',
    layout: 'full',
    alt: {
      ru: 'Вечерняя подсветка фасада: тёплая подсветка входных групп и архитектурная подсветка верхних этажей',
      kz: 'Қасбеттің кешкі жарығы: кіреберістердің жылы жарығы және жоғарғы қабаттардың сәулеттік жарығы',
      en: 'Facade lighting in the evening: warm lighting at the entrances and architectural lighting on the upper floors',
    },
  },
  aerial: {
    src: '/images/aerial.jpg',
    layout: 'wide',
    alt: {
      ru: 'Вид сверху на комплекс: три корпуса вокруг закрытого двора с детскими и спортивными площадками',
      kz: 'Кешеннің үстінен көрініс: балалар және спорт алаңдары бар жабық ауланы қоршаған үш корпус',
      en: 'Aerial view of the complex: three blocks around a car-free courtyard with playgrounds and sports areas',
    },
  },
  courtyard: {
    src: '/images/courtyard.jpg',
    layout: 'wide',
    alt: {
      ru: 'Внутренний двор без машин: прогулочные дорожки, озеленение, скамейки и детская площадка',
      kz: 'Көліксіз ішкі аула: серуен жолдары, көгалдандыру, орындықтар және балалар алаңы',
      en: 'Car-free inner courtyard: walking paths, planting, benches and a playground',
    },
  },
  playground: {
    src: '/images/playground.jpg',
    layout: 'card',
    alt: {
      ru: 'Детская площадка с резиновым покрытием, навесом и игровым комплексом',
      kz: 'Резеңке жабынды, қалқа және ойын кешені бар балалар алаңы',
      en: 'Playground with rubber surfacing, a canopy and a play structure',
    },
  },
  sport: {
    src: '/images/sport.jpg',
    layout: 'card',
    alt: {
      ru: 'Спортивная зона во дворе: воркаут-площадка, турники и стол для настольного тенниса',
      kz: 'Ауладағы спорт аймағы: воркаут алаңы, турниктер және үстел теннисіне арналған үстел',
      en: 'Outdoor sports zone: calisthenics area, pull-up bars and a table tennis table',
    },
  },
  landscape: {
    src: '/images/landscape.jpg',
    layout: 'card',
    alt: {
      ru: 'Прогулочный бульвар по периметру двора: крупномерные деревья, освещение и скамейки',
      kz: 'Аула периметріндегі серуен бульвары: ірі ағаштар, жарық және орындықтар',
      en: 'Promenade around the courtyard perimeter: mature trees, lighting and benches',
    },
  },
  'facade-detail': {
    src: '/images/facade-detail.jpg',
    layout: 'card',
    alt: {
      ru: 'Фрагмент фасада крупным планом: керамогранит, металлические откосы и витраж гостиной',
      kz: 'Қасбет фрагменті жақыннан: керамогранит, металл қиғаштар және қонақ бөлме витражы',
      en: 'Close-up of the facade: porcelain stoneware, metal reveals and living-room glazing',
    },
  },
  lobby: {
    src: '/images/lobby.jpg',
    layout: 'card',
    alt: {
      ru: 'Входная группа: лобби высотой 3,6 метра, керамогранитный пол и скрытая подсветка',
      kz: 'Кіреберіс тобы: биіктігі 3,6 метр лобби, керамогранит еден және жасырын жарық',
      en: 'Entrance group: a 3.6-metre lobby with porcelain stoneware floors and concealed lighting',
    },
  },
  'interior-living': {
    src: '/images/interior-living.jpg',
    layout: 'wide',
    alt: {
      ru: 'Интерьер гостиной с панорамными окнами от пола и потолками 3 метра',
      kz: 'Еденнен басталатын панорамалық терезелері және 3 метрлік төбелері бар қонақ бөлме интерьері',
      en: 'Living room interior with floor-to-ceiling windows and three-metre ceilings',
    },
  },
  parking: {
    src: '/images/parking.jpg',
    layout: 'card',
    alt: {
      ru: 'Отапливаемый подземный паркинг: разметка, освещение и въезд по пандусу',
      kz: 'Жылытылатын жерасты паркингі: таңбалау, жарық және пандуспен кіру',
      en: 'Heated underground parking: bay markings, lighting and a ramped entrance',
    },
  },
  commercial: {
    src: '/images/commercial.jpg',
    layout: 'card',
    alt: {
      ru: 'Коммерческое помещение на первом этаже с витринами и отдельным входом с улицы',
      kz: 'Бірінші қабаттағы витриналары және көше жағынан бөлек кіреберісі бар коммерциялық үй-жай',
      en: 'Ground-floor commercial unit with shopfronts and a separate street entrance',
    },
  },
  'construction-frame': {
    src: '/images/construction-frame.jpg',
    layout: 'card',
    alt: {
      ru: 'Этап строительства: монолитный каркас здания, опалубка и строительный кран',
      kz: 'Құрылыс кезеңі: ғимараттың монолитті каркасы, қалып және құрылыс краны',
      en: 'Construction stage: the monolithic frame of the building, formwork and a tower crane',
    },
  },
  'construction-facade': {
    src: '/images/construction-facade.jpg',
    layout: 'card',
    alt: {
      ru: 'Этап строительства: монтаж вентилируемого фасада и остекление',
      kz: 'Құрылыс кезеңі: желдетілетін қасбетті монтаждау және әйнектеу',
      en: 'Construction stage: installing the ventilated facade and glazing',
    },
  },
  'construction-yard': {
    src: '/images/construction-yard.jpg',
    layout: 'card',
    alt: {
      ru: 'Этап строительства: благоустройство двора, укладка покрытия и озеленение',
      kz: 'Құрылыс кезеңі: ауланы абаттандыру, жабын төсеу және көгалдандыру',
      en: 'Construction stage: courtyard landscaping, paving and planting',
    },
  },
  'og-cover': {
    src: '/images/og-cover.jpg',
    layout: 'wide',
    alt: {
      ru: 'Обложка для соцсетей: фасад жилого комплекса и название',
      kz: 'Әлеуметтік желілерге арналған мұқаба: тұрғын үй кешенінің қасбеті және атауы',
      en: 'Social share cover: the facade of the residential complex and its name',
    },
  },
};

export interface ResolvedImage extends MediaDefinition, ImageMeta {}

/** Manifest entry merged with the dimensions and blur placeholder on disk. */
export function getImage(key: MediaKey): ResolvedImage {
  const definition = MEDIA[key];
  const meta = IMAGE_META[definition.src];
  return {
    ...definition,
    width: meta?.width ?? 1600,
    height: meta?.height ?? 1067,
    blurDataURL: meta?.blurDataURL,
  };
}

export const ALL_MEDIA_KEYS = Object.keys(MEDIA) as MediaKey[];
