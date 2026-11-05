/** Texto con partes en Poppins (0) y en manuscrita Mrs Saint Delafield (1). */
export type Rich = readonly (readonly [text: string, script: 0 | 1])[];

export interface Step {
  img: string;
  title: string;
  text: string;
}

export interface Active {
  img: string;
  word: string;
  text: string;
}

export type Faq = readonly [question: string, answer: string];

export interface TreatmentPage {
  hero: {
    img: string;
    title: Rich;
    desc: string;
    duration: string;
    plan: string;
    price: string;
  };
  intro: { img: string; title: Rich; text: string };
  process: Step[];
  duration: { img: string; phrase: Rich; rows: [string, string][] };
  care: { pre: string[]; post: string[] };
  conditions: string[];
  actives: Active[];
  faq: Faq[];
}

export interface Treatment {
  slug: string;
  name: string;
  tagline: string;
  /** Texto corto de duración y precio, tal como aparece en la reserva. */
  meta: string;
  /** Descripción que se muestra en el índice de Tratamientos. */
  detail: string;
  cardImg: string;
  /** Foto grande del índice "conocé cada tratamiento", si no es la misma de la tarjeta. */
  detailImg?: string;
  page: TreatmentPage;
}

export type Category = 'Limpieza' | 'Tónicos' | 'Sérums' | 'Hidratantes' | 'Bálsamos' | 'Máscaras' | 'Rutinas';

export interface ProductDetail {
  breadcrumb: string;
  description: string;
  /**
   * Productos que trae una rutina: qué es, cuándo (corto para "Cómo usarla" y largo para "Brillo propio")
   * y cómo se aplica.
   */
  includes: {
    slug: string;
    text: string;
    when: string;
    whenLong: string;
    howTo: string;
    /** Foto de la modelo usándolo: `useImg` en escritorio y `useImgMobile` en la tarjeta de celular, si Figma usa otra. */
    useImg: string;
    useImgMobile?: string;
  }[];
  /** "02 · Detalles": frase, foto y filas. */
  phrase: Rich;
  detailImg: string;
  facts: [label: string, value: string][];
  /** Bajada de "Cómo usarla". */
  usage: string;
  /** Productos sugeridos para completar la compra. */
  upsell: string[];
  session: { treatmentSlug: string; label: string; price: number; img: string };
  /** "Sumá tu sesión" → en casa. */
  home: { text: string; img: string };
}

export interface Product {
  slug: string;
  /** Palabra manuscrita que encabeza la tarjeta. */
  word: string;
  name: string;
  subtitle: string;
  /** Precio en pesos. `null` = consultar. */
  price: number | null;
  originalPrice?: number;
  img: string;
  hoverImg: string;
  /** Si la foto ocupa toda la tarjeta (en vez de producto recortado). */
  fullBleed?: boolean;
  category: Category;
  inStock: boolean;
  /** `false` para productos que solo aparecen dentro de una rutina o como sugerencia. */
  listed: boolean;
  detail?: ProductDetail;
}

export interface Review {
  img: string;
  /** Foto para la tarjeta ancha de escritorio, si en Figma está recortada distinto. */
  imgWide?: string;
  text: string;
  name: string;
  skin: string;
  treatment: string;
}
