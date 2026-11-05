import { site } from '../data/site';
import type { CartItem } from './cart';
import { formatPrice, priceLabel } from './format';

/**
 * El sitio no tiene backend: turnos y pedidos se envían a la profesional
 * como un mensaje de WhatsApp ya armado, que la paciente solo tiene que mandar.
 */
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export interface Contact {
  name: string;
  phone: string;
  email: string;
  comment?: string;
}

const contactLines = (c: Contact) => [
  `Nombre: ${c.name}`,
  `WhatsApp: ${c.phone}`,
  `Email: ${c.email}`,
  ...(c.comment ? [`Comentario: ${c.comment}`] : []),
];

export function orderMessage(items: CartItem[], subtotal: number, contact: Contact, payment: string) {
  const lines = items.map(
    (i) =>
      `• ${i.qty} × ${i.product.name} — ${priceLabel(i.product.price)}${i.qty > 1 && i.product.price !== null ? ' c/u' : ''}${i.product.inStock ? '' : ' (sin stock)'}`,
  );
  return [
    `Hola Jazmín, quiero reservar este pedido para retirar en el consultorio:`,
    '',
    ...lines,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    `Forma de pago: ${payment}`,
    '',
    ...contactLines(contact),
  ].join('\n');
}

export function bookingMessage(treatment: string, when: string, contact: Contact) {
  return [
    `Hola Jazmín, quiero reservar un turno:`,
    '',
    `Tratamiento: ${treatment}`,
    `Día y horario: ${when}`,
    '',
    ...contactLines(contact),
  ].join('\n');
}
