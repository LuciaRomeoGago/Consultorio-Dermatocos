import type { Contact } from './whatsapp';

export type ContactErrors = Partial<Record<keyof Contact, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valida los datos de contacto. Devuelve un objeto vacío si está todo bien. */
export function validateContact(c: Contact): ContactErrors {
  const errors: ContactErrors = {};
  if (c.name.trim().length < 2) errors.name = 'Escribí tu nombre y apellido.';
  // Se aceptan espacios, guiones y el +54; lo que importa es que haya al menos 8 dígitos.
  if (c.phone.replace(/\D/g, '').length < 8) errors.phone = 'Revisá el número de WhatsApp.';
  if (!EMAIL.test(c.email.trim())) errors.email = 'Revisá el email.';
  return errors;
}

export const emptyContact: Contact = { name: '', phone: '', email: '', comment: '' };
