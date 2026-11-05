import type { Faq, Review, Rich } from './types';

/** Textos de cada página, tal como están en el diseño de Figma. */

export const home = {
  heroImg: '37c4d3246e',
  salud: {
    img: 'e61cf2d7ca',
    title: [['salud ', 0], ['& piel', 1]] as Rich,
    text: 'Tratamientos faciales personalizados, con diagnóstico previo y una rutina en casa pensada para tu piel.',
  },
  treatmentsTitle: [['tratamientos a ', 0], ['tu medida', 1]] as Rich,
  bestSellers: ['bio-top-skin-support', 'suero-glamour'],
  routine: {
    slug: 'rutina-luz',
    img: 'b56b3c9b49',
    text: 'Para pieles apagadas o expuestas al sol y la ciudad. Es la continuación en casa del tratamiento revitalizante.',
    /** Productos del acordeón, con el color de fondo de su foto en Figma. */
    steps: [
      {
        slug: 'emulsion-limpieza-suave',
        bg: '#dedfe6',
        text: 'Primer paso, mañana y noche. Limpia la piel con suavidad y la prepara para recibir los activos de la rutina.',
      },
      {
        slug: 'asthera-day',
        bg: '#e6e1da',
        text: 'Antioxidante de día. Protege la piel frente al sol y la contaminación. Aplicar a la mañana después de la limpieza, siempre con protector solar.',
      },
      {
        slug: 'asthera-night',
        bg: '#d9d8e8',
        text: 'Antioxidante de noche. Acompaña la renovación de la piel mientras descansás, para un tono más luminoso y parejo. Aplicar después de la limpieza.',
      },
    ],
  },
  instagram: {
    title: [['vos + ', 0], ['jazmín', 1]] as Rich,
    posts: ['8d8acea469', 'fee0468899', 'ed49301393', '6cba84ed4f'],
  },
};

export const approach = {
  img: '0886bd774f',
  title: [['hola, ', 0], ['soy jazmín', 1]] as Rich,
  lead: 'Cuidar la salud de tu piel hoy, para resultados que se sostienen en el tiempo.',
  tabs: [
    {
      label: 'Misión',
      img: 'd9ff0df54f',
      text: 'Brindar una atención integral y de excelencia a cada paciente, cuidando la salud de la piel: tratando afecciones específicas o preservando pieles sanas.',
    },
    {
      label: 'Visión',
      img: '711ce5c7a3',
      text: 'Seguir capacitándome de manera constante en cosmiatría y dermatocosmiatría para ofrecer una atención profesional, actualizada y de alta calidad.',
    },
    {
      label: 'Cómo trabajo',
      img: '5bff7e2c98',
      text: 'Empiezo siempre con un diagnóstico de tu piel. Elijo activos específicos para tu necesidad, ajustamos tu rutina en casa —protección de día, reparación de noche— y hago seguimiento después de la sesión.',
    },
  ],
};

export const reviews: Review[] = [
  {
    img: '363c1a48f8',
    imgWide: '363c1a48f8-r',
    text: 'Después de tres semanas con el protocolo de vitamina C, mis manchas post-inflamatorias han reducido visiblemente. La piel tiene una luminosidad que no había logrado con nada antes.',
    name: 'Valentina R.',
    skin: 'Piel mixta, tendencia acneica',
    treatment: 'Revitalizante / antioxidante',
  },
  {
    img: '99206dd030',
    text: 'Llegué con dudas por problemas de acné y salí con la piel más suave, pareja y con menos imperfecciones. Me sentí muy cómoda durante todo el tratamiento, noté cambios desde las primeras sesiones.',
    name: 'Matilda S.',
    skin: 'Tendencia acneica',
    treatment: 'Facial para acné',
  },
  {
    img: '30f5a258c2',
    text: 'Después de una semana del tratamiento, mi piel está luminosa, hidratada y uniforme. Jaz me explicó cada paso, me dio recomendaciones claras para cuidarme y los resultados superaron mis expectativas.',
    name: 'Anabel O.',
    skin: 'Piel mixta deshidratada',
    treatment: 'Limpieza profunda',
  },
];

export const treatmentsPage = {
  title: [['nuestros\n', 0], ['tratamientos', 1]] as Rich,
  heroImg: '37c4d3246e-arriba', // solo la franja de arriba del collage, como el recorte de Figma
  diagnosis:
    'Cada tratamiento comienza con un diagnóstico personalizado de tu piel. Sin protocolos genéricos, sin pasos innecesarios.',
  offerTitle: [['lo que te ', 0], ['ofrecemos', 1]] as Rich,
  offerText: 'Protocolos diseñados por especialistas, adaptados a tu fototipo, preocupaciones y objetivos.',
  indexTitle: [['conocé cada\n', 0], ['tratamiento', 1]] as Rich,
  /** Orden del índice "conocé cada tratamiento" en Figma. */
  indexOrder: [
    'skincoaching',
    'higiene-facial-profunda',
    'revitalizante-antioxidante',
    'rosacea-piel-sensible',
    'facial-para-acne',
    'para-manchas',
    'facial-anti-age',
    'microneedling-exosomas',
    'dermaplaning',
    'hidralips',
  ],
  quote: [
    ['“Cada sesión es una ', 0],
    ['inversión', 1],
    [' en la ', 0],
    ['salud', 1],
    [' de tu piel.”', 0],
  ] as Rich,
  session: [
    {
      label: 'diagnóstico',
      title: 'primero, conocer\ntu piel',
      img: 'e06e4a79c2',
      text: 'Todos los tratamientos son totalmente personalizados e incluyen un diagnóstico previo, donde elegimos productos y activos específicos para la necesidad de cada piel.',
    },
    {
      label: 'tratamiento en cabina',
      title: 'hecho a tu\nmedida',
      img: 'df8d0edd8a',
      text: 'Aplicamos el protocolo elegido para tu piel, con productos de primera calidad y específicos para cada tipo de piel.',
    },
    {
      label: 'rutina en casa',
      title: 'lo que empieza en cabina,\nsigue en casa',
      img: 'de7595987e',
      text: 'Trabajaremos sobre tu rutina de cuidado de piel en domicilio, la ajustaremos a las necesidades de tu piel, siempre respetando la cronobiología de esta, teniendo en cuenta que de día vamos a hacer hincapié en la hidratación y protección a la agresión ambiental y por la noche nos vamos a dedicar a la reparación celular.',
    },
    {
      label: 'seguimiento',
      title: 'tu piel no termina\nen la sesión',
      img: '458d2dfa0a',
      text: 'Luego de haber finalizado la sesión, haremos un seguimiento de tu caso y estaremos siempre a disposición por cualquier duda.',
    },
  ],
  homeRoutine: ['rutina-luz', 'emulsion-limpieza-suave', 'asthera-day'],
  faq: [
    [
      '¿Necesito un diagnóstico antes de empezar?',
      'Sí. Todos los tratamientos son totalmente personalizados e incluyen un diagnóstico previo, donde elegimos productos y activos específicos para la necesidad de tu piel.',
    ],
    [
      '¿Cómo sé qué tratamiento es para mí?',
      'Si no sabés por dónde empezar, reservá un turno de Skincoaching: evaluamos tu piel y te armamos un plan de tratamiento personalizado.',
    ],
    ['¿Cuánto dura una sesión?', 'Depende del tratamiento: la mayoría de las sesiones duran entre 45 y 65 minutos.'],
    [
      '¿Cómo reservo un turno?',
      'Online, desde la web, en menos de 2 minutos y sin necesidad de llamar. Podés reprogramar hasta 24hs antes sin costo.',
    ],
    [
      '¿Cómo compro los productos?',
      'Reservás tus productos desde la web y los retirás en el consultorio. Podés pagar por transferencia o en efectivo al retirar.',
    ],
  ] as Faq[],
};

export const protocol = {
  title: [['tu piel merece\nun protocolo ', 0], ['propio', 1], ['.', 0]] as Rich,
  text: 'Recibí una rutina formulada específicamente para tu fototipo, preocupaciones y tolerancia.',
  img: '5821f9a65b',
};

export const bookingPage = {
  title: [['reservá tu\n', 0], ['turno', 1]] as Rich,
  lead: 'En menos de 2 minutos, sin necesidad de llamar',
  steps: ['Elegí el tratamiento', 'Elegí día y horario', 'Confirmá tus datos'],
  listTitle: 'Seleccioná el tratamiento que quieras reservar',
  quote: [['“Cuidamos la ', 0], ['salud', 1], [' de tu piel como nuestra máxima prioridad.”', 0]] as Rich,
  /** Orden de la lista de tratamientos en Figma. */
  order: [
    'skincoaching',
    'facial-anti-age',
    'para-manchas',
    'facial-para-acne',
    'rosacea-piel-sensible',
    'revitalizante-antioxidante',
    'higiene-facial-profunda',
    'microneedling-exosomas',
    'dermaplaning',
    'hidralips',
  ],
  policy: 'Se confirma con una seña del 25% que se descuenta del total. Si cancelás con 24 hs de anticipación, te la devolvemos.',
  faq: [
    [
      '¿Cómo funciona la seña?',
      'Al reservar te mostramos el alias para transferir el 25% del tratamiento. Tenés 30 minutos para hacerlo y mandar el comprobante por WhatsApp; si no, el horario se libera. La seña se descuenta del total y, si cancelás con 24 hs de anticipación, te la devolvemos.',
    ],
    [
      '¿Qué pasa si llego tarde?',
      'Te pedimos que llegues 5-10 minutos antes de tu turno. Si llegás tarde, es posible que debamos acortar la sesión para no atrasar a los siguientes pacientes, o reprogramarla según la disponibilidad del día. Si sabés que vas a demorarte, avisanos por WhatsApp y hacemos lo posible por reorganizar.',
    ],
    [
      '¿Necesito preparar algo antes de mi primera consulta?',
      'No hace falta ninguna preparación especial. Te recomendamos venir con la piel limpia, sin maquillaje si es posible, y evitar la exposición solar directa los días previos. Si estás usando ácidos, retinoides u otros tratamientos dermatológicos, contanoslo al momento de reservar o al llegar a la consulta.',
    ],
    [
      '¿Puedo venir sin diagnóstico previo?',
      'Sí, de hecho es lo más recomendable si es tu primera vez o no estás segura de qué tratamiento necesitás. Podés reservar directamente el turno de Skincoaching: ahí evaluamos tu piel y te armamos un plan de tratamiento personalizado.',
    ],
  ] as Faq[],
};

export const shopPage = {
  title: [['todo lo que tu piel\n', 0], ['necesita', 1]] as Rich,
  heroImg: 'a1cee40140',
  notSure: { title: '¿No sabés qué usar?', img: 'd39983365a' },
};

export const orderPage = {
  title: [['tu ', 0], ['pedido', 1]] as Rich,
  lead: 'Reservá tus productos y retiralos en el consultorio.',
  payments: [
    { id: 'transferencia', label: 'Transferencia', text: 'Te pasamos los datos al confirmar el pedido.' },
    { id: 'efectivo', label: 'Efectivo', text: 'Pagás en el consultorio al retirar.' },
  ],
  note: 'No se cobra nada online. Te escribimos por WhatsApp para coordinar el retiro.',
  outOfStock: 'Sin stock · lo reservamos y te avisamos cuando llegue',
  done: {
    title: [['pedido ', 0], ['reservado', 1]] as Rich,
    text: 'Te escribimos por WhatsApp cuando tu pedido esté listo para retirar en el consultorio.',
  },
} as const;

export const aboutPage = {
  heroImg: '458d2dfa0a',
  title: [['hola,\nsoy ', 0], ['jazmín', 1]] as Rich,
  lead: 'Cuidar la salud de tu piel hoy,\npara resultados que se sostienen en el tiempo.',
  text: 'Los tratamientos de mi consultorio son personalizados, y están diseñados para ayudar a pieles dañadas y cuidar las pieles sanas. Siempre con el objetivo de poner en primer lugar la salud del órgano más grande que tenemos los seres humanos.',
  note: '“Mi misión es que se vayan del consultorio contentos con el resultado, y poder generar la confianza suficiente para acompañarlos también con su rutina en casa.”',
  /** Fotos de "Conocé mi enfoque", en el orden de las pestañas Misión, Visión y Cómo trabajo. */
  focusImgs: ['ff4404e46b', '711ce5c7a3', '5821f9a65b'],
  /** "Mis productos": el carrusel de "los más elegidos". */
  products: ['emulsion-limpieza-suave', 'acqua-di-jojoba', 'asthera-day', 'bio-top-skin-support', 'suero-glamour', 'emulfresh', 'suero-rediles'],
  /** `img`: tarjeta de celular; `slideImg`: foto que se desliza en escritorio. */
  values: [
    { title: 'diagnóstico previo', img: 'e06e4a79c2', slideImg: 'e06e4a79c2', text: 'Todos los tratamientos son totalmente personalizados e incluyen un diagnóstico previo.' },
    { title: 'activos profesionales', img: '2a7c99c00d', slideImg: 'd48c0cd73e', text: 'Trabajamos únicamente con activos de grado clínico y productos formulados para uso profesional.' },
    { title: 'rutina domiciliaria', img: '0131b3bd54', slideImg: '8d8acea469', text: 'Ajustamos tu rutina en casa a las necesidades de tu piel: de día, hidratación y protección; de noche, reparación.' },
    { title: 'seguimiento post sesión', img: 'f90176209a', slideImg: '458d2dfa0a', text: 'Luego de la sesión hacemos un seguimiento de tu caso y estamos siempre a disposición por cualquier duda.' },
  ],
  behind: {
    img: 'b7678a8c3d',
    name: [['jazmín ', 1], ['sarasti', 1]] as Rich,
    text: 'Como visión, sigo capacitándome para brindar un mejor servicio cada día y poder destacarme en el campo de la cosmiatría y la dermatocosmiatría.',
    facts: [
      ['Especialidad', 'Cosmiatría y dermatocosmiatría'],
      ['Consultorio', 'Tandil, Buenos Aires'],
    ] as [string, string][],
  },
};
