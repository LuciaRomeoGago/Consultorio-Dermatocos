import type { ReactNode } from 'react';
import { img } from '../lib/format';
import './PanelGallery.css';

export interface GalleryImage {
  key: string;
  /** Fondo de color con el producto recortado encima (galería de la rutina). */
  bg?: string;
  alt?: string;
}

interface Props {
  images: GalleryImage[];
  active: number;
  children: ReactNode;
  className?: string;
  label?: string;
}

/**
 * Tarjeta gris con texto a la izquierda y fotos a la derecha (secciones "Conocé mi enfoque" y "Rutina luz").
 * Como en el prototipo de Figma, la foto nueva entra desde la izquierda y la anterior sale por la derecha.
 */
export function PanelGallery({ images, active, children, className = '', label }: Props) {
  return (
    <section className={`panel-gallery ${className}`.trim()} aria-label={label}>
      <div className="panel-gallery__images">
        {images.map((image, i) => {
          const state = i === active ? 'active' : i < active ? 'after' : 'before';
          return (
            <div
              key={image.key + i}
              className={`panel-gallery__image${image.bg ? ' panel-gallery__image--product' : ''}`}
              data-state={state}
              style={image.bg ? { background: image.bg } : undefined}
              aria-hidden={state !== 'active'}
            >
              <img src={img(image.key)} alt={state === 'active' ? (image.alt ?? '') : ''} loading="lazy" />
            </div>
          );
        })}
      </div>
      <div className="panel-gallery__panel">{children}</div>
    </section>
  );
}
