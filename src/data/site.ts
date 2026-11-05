export const site = {
  name: 'Jazmín Sarasti Dermocosmética',
  topBar: ['Turnos online en menos de 2 minutos', 'Chacabuco 985 1B', 'Envíos a todo el país'],
  address: 'Chacabuco 985 1B',
  city: 'Tandil, Buenos Aires',
  hours: 'Lunes a viernes de 8 a 20 hs',
  /** Días y horario de atención, usados para armar los turnos. */
  schedule: { days: [1, 2, 3, 4, 5], open: 8, close: 20 },
  whatsapp: '+54 249 436 5460',
  whatsappNumber: '5492494365460',
  instagram: '@jazsarasti.dc',
  instagramUrl: 'https://www.instagram.com/jazsarasti.dc/',
  /** EJEMPLO: reemplazar por los datos reales de la cuenta para la seña. */
  transfer: { alias: 'JAZMIN.SARASTI.DC', cbu: '0000003100000000000000', titular: 'Jazmín Sarasti' },
  values: ['Diagnóstico previo', 'Activos de grado profesional', 'Rutina domiciliaria', 'Seguimiento post sesión'],
};

export const nav = [
  { label: 'Tratamientos', to: '/tratamientos' },
  { label: 'Productos', to: '/tienda' },
  { label: 'Conócenos', to: '/conocenos' },
];
