import type { Rich, Treatment } from './types';

/** Textos compartidos por todas las páginas de tratamiento. */
export const treatmentCommon = {
  processTitle: [['cómo\n', 0], ['funciona', 1], ['\nla sesión', 0]] as Rich,
  durationLabel: 'Duración y sesiones recomendadas',
  conditionsTitle: [['¿es para ', 0], ['tu piel', 1], [' ?', 0]] as Rich,
  conditionsIntro: 'Es importante informarnos si presentás alguna de las siguientes condiciones.',
  conditionsOutro:
    'Ante cualquier duda, realizamos una evaluación previa y te recomendamos consultar con un profesional de la salud si corresponde.',
  activesNote:
    'Trabajamos únicamente con activos de grado clínico y productos formulados para uso profesional. Cada protocolo es adaptado y ajustado según el diagnóstico inicial de la piel.',
  index: ['El proceso', 'Duración y sesiones', 'Cuidados pre y post', '¿Es para tu piel?', 'Activos clave', 'Preguntas frecuentes'],
  /** Testimonios del bloque "08 · Testimonio" de la ficha. */
  quotes: [
    {
      text: [
        ['“mis manchas se redujeron visiblemente y la piel tiene una ', 0],
        ['luminosidad', 1],
        [' que no había logrado con nada antes.”', 0],
      ] as Rich,
      author: 'Valentina R. — Revitalizante / antioxidante',
    },
    {
      text: [
        ['“llegué con dudas por problemas de acné y salí con la piel más ', 0],
        ['suave, pareja', 1],
        [' y con menos imperfecciones.”', 0],
      ] as Rich,
      author: 'Candela S. — Facial para acné',
    },
    {
      text: [
        ['“mi piel luce más ', 0],
        ['luminosa y uniforme', 1],
        ['. Jaz me explicó cada paso, me dio recomendaciones claras, los resultados superaron mis expectativas.”', 0],
      ] as Rich,
      author: 'Amelia L. — Limpieza profunda',
    },
  ],
};

export const treatments: Treatment[] = [
  {
    slug: 'skincoaching',
    name: 'Skincoaching',
    tagline: 'Tu rutina, con criterio y estrategia',
    meta: '60 min · $40.000',
    detail:
      'Evaluación profesional para entender tu tipo de piel y armar una rutina de cuidado de piel adaptada a tus necesidades.\nIdeal si no sabés qué productos usar o si querés optimizar tu rutina actual.\nTe permite empezar a cuidar tu piel con criterio y estrategia.',
    cardImg: 'e6e04a9ddd',
    detailImg: 'b844261218',
    page: {
      hero: {
        img: 'e6e04a9ddd',
        title: [['sesión de\n', 0], ['skincoaching', 1]],
        desc: 'Evaluación profesional para entender tu tipo de piel y armar una rutina de cuidado de piel adaptada a tus necesidades. Ideal si no sabés qué productos usar o si querés optimizar tu rutina actual.',
        duration: '60 min',
        plan: 'Sesión individual',
        price: '$40.000',
      },
      intro: {
        img: '711ce5c7a3',
        title: [['tu piel, ', 0], ['entendida', 1]],
        text: 'Evaluamos tu tipo de piel, tus preocupaciones y lo que usás hoy para armar una rutina posible de sostener, con productos y activos elegidos para vos.',
      },
      process: [
        { img: '0ffe9b445b', title: 'Charla inicial', text: 'Conversamos sobre tus preocupaciones, tus hábitos y los productos que usás hoy.' },
        { img: '73e4d6adc7', title: 'Análisis de la piel', text: 'Evaluamos tipo de piel, fototipo, hidratación, sensibilidad y estado de la barrera cutánea.' },
        { img: 'e06e4a79c2', title: 'Observación en detalle', text: 'Con la piel limpia observamos textura, poros, manchas y zonas de reactividad.' },
        { img: '6511677a9b', title: 'Objetivos', text: 'Definimos objetivos realistas y el orden de prioridades para tu piel.' },
        { img: 'df8d0edd8a', title: 'Rutina a medida', text: 'Armamos tu rutina de día y de noche, con productos y activos específicos para tu necesidad.' },
        { img: '52cb4a3851', title: 'Seguimiento', text: 'Revisamos cómo responde tu piel y ajustamos la rutina cuando haga falta.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Tu rutina, ', 0], ['con criterio', 1]],
        rows: [
          ['Duración:', '60 minutos'],
          ['Modalidad:', 'Sesión individual en el consultorio'],
          ['Seguimiento:', 'Ajustes según la respuesta de tu piel'],
          ['Ideal para:', 'Empezar o reordenar tu rutina'],
        ],
      },
      care: {
        pre: [
          'Venir con la piel limpia y, si es posible, sin maquillaje.',
          'Traer los productos que usás hoy o fotos de sus etiquetas.',
          'Contarnos si usás ácidos, retinoides u otros tratamientos.',
        ],
        post: [
          'Incorporar los productos nuevos de a uno por vez.',
          'Usar protector solar todos los días, aunque esté nublado.',
          'Observar cómo responde tu piel las primeras semanas.',
          'Consultarnos ante cualquier duda o reacción.',
        ],
      },
      conditions: [
        'Piel muy sensible o reactiva.',
        'Irritación o lesiones activas.',
        'Alergias conocidas a ingredientes cosméticos.',
        'Tratamientos dermatológicos en curso.',
        'Embarazo o lactancia.',
        'Medicación que afecte la piel, como isotretinoína.',
      ],
      actives: [
        { img: 'c9a89c29c7', word: 'limpieza', text: 'La base de todo: una piel limpia absorbe mejor y responde mejor a los activos.' },
        { img: 'dbb7c88db9', word: 'hidratación', text: 'Mantiene la barrera cutánea fuerte y la piel cómoda todo el día.' },
        { img: '0d1a73ac85', word: 'protección solar', text: 'El paso que sostiene cualquier resultado y previene manchas y envejecimiento.' },
        { img: '4a967d32e3', word: 'activos específicos', text: 'Los elegimos según tu necesidad: manchas, acné, sensibilidad o firmeza.' },
      ],
      faq: [
        ['¿Qué incluye el skincoaching?', 'Una evaluación completa de tu piel, la revisión de los productos que usás y una rutina de día y de noche pensada para vos.'],
        ['¿Tengo que comprar productos nuevos?', 'No necesariamente. Primero revisamos lo que ya tenés y sumamos solo lo que tu piel realmente necesita.'],
        ['¿Sirve si nunca tuve una rutina?', 'Sí, es el mejor punto de partida para empezar a cuidar tu piel con criterio.'],
        ['¿Cada cuánto conviene repetirlo?', 'Cuando cambian tus necesidades, la estación o tu piel no responde como esperabas.'],
      ],
    },
  },
  {
    slug: 'rosacea-piel-sensible',
    name: 'Rosácea / piel sensible',
    tagline: 'Calma y barrera fortalecida',
    meta: '60 min · $55.000',
    detail:
      'Comenzamos con el diagnóstico del paciente. En este tratamiento se utilizan productos de primera calidad específicos para pieles reactivas, con el objetivo de fortalecer la barrera cutánea, calmar y recuperar la piel, mejorando el enrojecimiento y la irritación.',
    cardImg: 'ca616fad28',
    page: {
      hero: {
        img: 'ca616fad28',
        title: [['piel ', 0], ['sensible', 1]],
        desc: 'Utilizamos productos de primera calidad específicos para pieles reactivas, con el objetivo de fortalecer la barrera cutánea, calmar y recuperar la piel, mejorando el enrojecimiento y la irritación.',
        duration: '60 min',
        plan: 'Según evaluación',
        price: '$55.000',
      },
      intro: {
        img: '458d2dfa0a',
        title: [['calma & ', 0], ['barrera', 1]],
        text: 'Calmamos, fortalecemos la barrera cutánea y mejoramos el enrojecimiento, con productos pensados para pieles reactivas.',
      },
      process: [
        { img: '3c1afb6e36', title: 'Diagnóstico de la piel', text: 'Evaluamos el grado de sensibilidad, el enrojecimiento y los factores que lo desencadenan.' },
        { img: 'ed49301393', title: 'Limpieza suave', text: 'Higiene con productos sin fragancia, a temperatura templada y sin fricción.' },
        { img: '6cba84ed4f', title: 'Activos calmantes', text: 'Aplicación de activos descongestivos y antiinflamatorios.' },
        { img: '6511677a9b', title: 'Masaje drenante', text: 'Maniobras suaves que descongestionan sin estimular el enrojecimiento.' },
        { img: 'df8d0edd8a', title: 'Máscara reparadora', text: 'Hidrata y ayuda a recuperar la barrera cutánea.' },
        { img: '8d8acea469', title: 'Protección final', text: 'Protector solar mineral para cuidar la piel del sol y del calor.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Una piel ', 0], ['en calma,', 1], [' paso a paso.', 0]],
        rows: [
          ['Duración:', '60 minutos'],
          ['Plan inicial:', 'Según evaluación'],
          ['Frecuencia:', 'Cada 15 a 21 días, según indicación'],
          ['Mantenimiento:', 'Según la evolución de tu piel'],
        ],
      },
      care: {
        pre: [
          'Evitar calor intenso, sauna y ejercicio fuerte el día del turno.',
          'No aplicar ácidos, retinoides ni exfoliantes 3 días antes.',
          'Contarnos qué productos o situaciones te generan reacción.',
        ],
        post: [
          'Evitar el calor, el sol directo y el agua muy caliente.',
          'Usar protector solar mineral todos los días.',
          'No usar exfoliantes ni ácidos por unos días.',
          'Mantener la rutina calmante indicada para casa.',
        ],
      },
      conditions: [
        'Brote activo severo o piel lastimada.',
        'Alergias conocidas a ingredientes cosméticos.',
        'Tratamientos dermatológicos en curso.',
        'Rosácea sin diagnóstico médico.',
        'Embarazo o lactancia.',
        'Cualquier condición de salud dermatológica relevante.',
      ],
      actives: [
        { img: 'b1535029ed', word: 'niacinamida', text: 'Calma el enrojecimiento y fortalece la barrera.' },
        { img: 'c47954c505', word: 'centella asiática', text: 'Repara y descongestiona la piel reactiva.' },
        { img: '025e87cafa', word: 'ceramidas', text: 'Reconstruyen la barrera y retienen la hidratación.' },
        { img: '45612dd9a0', word: 'pantenol', text: 'Calmante e hidratante, reduce la irritación.' },
      ],
      faq: [
        ['¿Puedo hacerlo si tengo rosácea diagnosticada?', 'Sí, y es muy recomendable. Trabajamos en conjunto con las indicaciones de tu médico.'],
        ['¿El enrojecimiento puede aumentar después?', 'Puede haber un leve enrojecimiento que se va en pocas horas.'],
        ['¿Cuántas sesiones necesito?', 'Depende de tu piel. Lo definimos en el diagnóstico y ajustamos según la evolución.'],
        ['¿Qué tengo que evitar en casa?', 'Calor, agua muy caliente, exfoliantes y productos con fragancia.'],
      ],
    },
  },
  {
    slug: 'facial-para-acne',
    name: 'Facial para acné',
    tagline: 'Control activo, piel en equilibrio',
    meta: '65 min · $55.000',
    detail:
      'Este tratamiento está pensado y diseñado para pieles con tendencia al acné o muy oleosas. Elegimos productos de primera calidad y específicos para reducir la inflamación, eliminar poros obstruidos y controlar futuros brotes. Incluye una limpieza profunda con exfoliación según la necesidad, extracción de impurezas, alta frecuencia, y activos específicos para la necesidad de cada piel.',
    cardImg: 'dd4fdf44a5',
    page: {
      hero: {
        img: 'dd4fdf44a5',
        title: [['facial para ', 0], ['acné', 1]],
        desc: 'Pensado y diseñado para pieles con tendencia al acné o muy oleosas. Elegimos productos de primera calidad y específicos para reducir la inflamación, eliminar poros obstruidos y controlar futuros brotes.',
        duration: '65 min',
        plan: '4 a 6 sesiones',
        price: '$55.000',
      },
      intro: {
        img: 'ff4404e46b',
        title: [['piel en ', 0], ['equilibrio', 1]],
        text: 'Reducimos la inflamación, destapamos los poros obstruidos y regulamos el sebo para prevenir nuevos brotes.',
      },
      process: [
        { img: '3c1afb6e36', title: 'Diagnóstico de la piel', text: 'Evaluamos el tipo de acné, la oleosidad y la sensibilidad de tu piel.' },
        { img: 'ed49301393', title: 'Limpieza profunda', text: 'Doble limpieza con productos específicos para pieles grasas o con tendencia acneica.' },
        { img: '6cba84ed4f', title: 'Exfoliación', text: 'Exfoliación química o enzimática según la necesidad, para renovar y destapar poros.' },
        { img: '6511677a9b', title: 'Extracciones', text: 'Extracción cuidadosa de comedones e impurezas, respetando la piel.' },
        { img: 'df8d0edd8a', title: 'Alta frecuencia', text: 'Efecto antiséptico y descongestivo que ayuda a secar las lesiones activas.' },
        { img: '8d8acea469', title: 'Máscara y activos', text: 'Máscara seborreguladora y activos calmantes, seguidos de protector solar.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Las sesiones ', 0], ['duran', 1], [' 65 minutos.', 0]],
        rows: [
          ['Duración:', '65 minutos'],
          ['Plan inicial:', '4 a 6 sesiones'],
          ['Frecuencia:', 'Cada 15 días, según indicación'],
          ['Mantenimiento:', 'Mensual, para sostener el resultado'],
        ],
      },
      care: {
        pre: [
          'Evitar exfoliantes y ácidos fuertes 48hs antes.',
          'No manipular ni apretar granitos los días previos.',
          'Informar si estás tomando medicación para el acné.',
        ],
        post: [
          'No tocar ni apretar las lesiones.',
          'Evitar el maquillaje durante 24hs.',
          'Usar protector solar oil free.',
          'Seguir la rutina seborreguladora indicada para casa.',
        ],
      },
      conditions: [
        'Tratamiento con isotretinoína en curso o reciente.',
        'Heridas abiertas o lesiones muy inflamadas.',
        'Herpes activo.',
        'Alergias conocidas a ingredientes cosméticos.',
        'Embarazo o lactancia.',
        'Tratamientos dermatológicos en curso.',
      ],
      actives: [
        { img: 'dbb7c88db9', word: 'ácido salicílico', text: 'Penetra el poro, lo destapa y reduce la oleosidad.' },
        { img: '8766f27538', word: 'niacinamida', text: 'Regula el sebo y calma la inflamación.' },
        { img: 'a573345783', word: 'zinc', text: 'Seborregulador y antibacteriano.' },
        { img: '6927888ab1', word: 'alta frecuencia', text: 'Efecto antiséptico que ayuda a secar las lesiones.' },
      ],
      faq: [
        ['¿Sirve si tengo acné hormonal?', 'Ayuda a controlar los brotes y la inflamación. Si el origen es hormonal, lo ideal es acompañarlo con una consulta médica.'],
        ['¿Puede empeorar antes de mejorar?', 'En las primeras sesiones la piel puede purgar. Es esperable y lo acompañamos con la rutina en casa.'],
        ['¿Duelen las extracciones?', 'Pueden resultar un poco molestas, pero se hacen con cuidado y respetando tu piel.'],
        ['¿Qué rutina tengo que seguir en casa?', 'Te armamos una rutina seborreguladora simple, con protector solar oil free.'],
      ],
    },
  },
  {
    slug: 'para-manchas',
    name: 'Para manchas',
    tagline: 'Luminosidad pareja, tono unificado',
    meta: '60 min · $75.000',
    detail:
      'Combinación de vitamina C estabilizada, ácido kójico y retinoides que actúan sobre la melanogénesis para despigmentar manchas post-inflamatorias, solares y hormonales, devolviendo al rostro su tono natural.',
    cardImg: 'df8d0edd8a',
    page: {
      hero: {
        img: 'df8d0edd8a',
        title: [['tratamiento para\n', 0], ['manchas', 1]],
        desc: 'Combinación de vitamina C estabilizada, ácido kójico y retinoides que actúan sobre la melanogénesis para despigmentar manchas post-inflamatorias, solares y hormonales, devolviendo al rostro su tono natural.',
        duration: '60 min',
        plan: '4 a 6 sesiones',
        price: '$75.000',
      },
      intro: {
        img: '458d2dfa0a',
        title: [['tono ', 0], ['unificado', 1]],
        text: 'Actuamos sobre la producción de melanina para aclarar manchas post-inflamatorias, solares y hormonales, y devolverle a tu piel su tono natural.',
      },
      process: [
        { img: '3c1afb6e36', title: 'Diagnóstico de la piel', text: 'Identificamos el tipo de mancha, su profundidad y tu fototipo para elegir el protocolo.' },
        { img: 'ed49301393', title: 'Limpieza y preparación', text: 'Higiene profunda y preparación de la piel para potenciar la penetración de activos.' },
        { img: '6cba84ed4f', title: 'Peeling despigmentante', text: 'Ácidos específicos que renuevan la capa superficial y aclaran las manchas.' },
        { img: '6511677a9b', title: 'Activos despigmentantes', text: 'Vitamina C estabilizada, ácido kójico y retinoides que actúan sobre la melanina.' },
        { img: 'df8d0edd8a', title: 'Máscara calmante', text: 'Hidrata, calma y reduce el enrojecimiento posterior.' },
        { img: '8d8acea469', title: 'Protección final', text: 'Cerramos con protector solar de amplio espectro, clave para sostener el resultado.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Las sesiones ', 0], ['duran', 1], [' 60 minutos.', 0]],
        rows: [
          ['Duración:', '60 minutos'],
          ['Plan inicial:', '4 a 6 sesiones'],
          ['Frecuencia:', 'Cada 15 a 21 días, según indicación'],
          ['Mantenimiento:', 'Según la evolución de tu piel'],
        ],
      },
      care: {
        pre: [
          'Evitar la exposición solar directa los días previos.',
          'Suspender ácidos y retinoides 3 a 5 días antes, o según indicación.',
          'Informar si estás usando medicación o tratamientos dermatológicos.',
        ],
        post: [
          'Protector solar todos los días, reaplicando cada 2 a 3 horas.',
          'Evitar sol directo, pileta y sauna durante 48-72hs.',
          'No arrancar ni frotar si la piel descama.',
          'Seguir la rutina despigmentante indicada para casa.',
        ],
      },
      conditions: [
        'Piel muy sensible o reactiva.',
        'Irritación, inflamación o lesiones activas.',
        'Herpes activo en la zona a tratar.',
        'Exposición solar intensa reciente o bronceado.',
        'Embarazo o lactancia.',
        'Tratamientos dermatológicos en curso.',
      ],
      actives: [
        { img: '6ed3857a0e', word: 'vitamina C', text: 'Antioxidante que frena la producción de melanina y aporta luminosidad.' },
        { img: 'af99358805', word: 'ácido kójico', text: 'Despigmentante que inhibe la enzima responsable de las manchas.' },
        { img: '3bb6943b7a', word: 'retinoides', text: 'Aceleran la renovación celular para aclarar y unificar el tono.' },
        { img: '08889ed319', word: 'niacinamida', text: 'Unifica el tono, calma y fortalece la barrera cutánea.' },
      ],
      faq: [
        ['¿Cuántas sesiones necesito?', 'Depende del tipo y la profundidad de la mancha. En general se recomiendan entre 4 y 6 sesiones.'],
        ['¿Las manchas pueden volver?', 'Sí, si no hay protección solar diaria. Por eso la rutina en casa y el protector son parte del tratamiento.'],
        ['¿Puedo hacerlo en verano?', 'Se puede, con cuidados estrictos de protección solar. Lo evaluamos en el diagnóstico.'],
        ['¿Es doloroso?', 'No. Podés sentir un leve ardor o calor durante el peeling, que desaparece rápido.'],
      ],
    },
  },
  {
    slug: 'facial-anti-age',
    name: 'Facial anti-age',
    tagline: 'Firmeza, densidad y juventud duradera',
    meta: '45 min · $60.000',
    detail:
      'Formulado para tratar los signos del envejecimiento. Para este tratamiento elegimos productos de primera calidad que estimulan la producción de colágeno y elastina, reduciendo la apariencia de arrugas y líneas de expresión, y mejorando la firmeza y elasticidad de la piel.\nLas sesiones duran 45 minutos. Se recomienda un plan de 4 a 6 sesiones iniciales (frecuencia según indicación profesional), con sesiones de mantenimiento mensuales.',
    cardImg: '1a3d381f58',
    page: {
      hero: {
        img: '39f128d9bd',
        title: [['tratamiento ', 0], ['antiage', 1]],
        desc: 'Enfocado en prevenir y tratar los signos del envejecimiento cutáneo: líneas de expresión, pérdida de firmeza, luminosidad opaca y textura irregular.\nIndicado para pieles maduras o pieles jóvenes que quieren empezar una rutina preventiva, estimulando la renovación celular y la producción de colágeno.',
        duration: '45 min',
        plan: '4 a 6 sesiones',
        price: '$60.000',
      },
      intro: {
        img: 'c59df66be7',
        title: [['firmeza &\n', 0], ['regeneración', 1]],
        text: 'Estimulamos la producción endógena de colágeno con activos clínicamente probados.\nCada sesión es un ciclo de regeneración tisular real.',
      },
      process: [
        { img: 'bd8b2e255f', title: 'Diagnóstico de la piel', text: 'Análisis de líneas de expresión, pérdida de firmeza y calidad de barrera para diseñar el protocolo antiage personalizado.' },
        { img: 'ed49301393', title: 'Limpieza enzimática doble', text: 'Doble limpieza que elimina sebo oxidado y prepara la piel para la máxima absorción de activos regeneradores.' },
        { img: '5f8f9f3bd2', title: 'Peeling de retinol', text: 'Retinol microencapsulado al 0.5% aplicado con técnica de liberación progresiva para estimular renovación celular sin irritación.' },
        { img: '6511677a9b', title: 'Masaje con péptidos', text: 'Técnica de masaje facial con péptidos biomiméticos y vitamina E que mejora circulación y tono muscular.' },
        { img: 'fee0468899', title: 'Radiofrecuencia o LED', text: 'Radiofrecuencia monopolar o terapia LED roja (630nm) para estimular fibroblastos y síntesis de colágeno endógeno.' },
        { img: '8d8acea469', title: 'Sellado nutritivo', text: 'Mascarilla oclusiva con ceramidas, escualano y ácido hialurónico triple peso para sellado y nutrición profunda.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Las ', 0], ['sesiones', 1], ['\nduran 45 minutos.', 0]],
        rows: [
          ['Duración:', '45 minutos'],
          ['Plan inicial:', '4 a 6 sesiones'],
          ['Frecuencia:', 'Según indicación profesional'],
          ['Mantenimiento:', 'Sesiones mensuales'],
        ],
      },
      care: {
        pre: [
          'No exponerse al sol ni haberse expuesto en exceso los días previos.',
          'Evitar depilación o exfoliantes fuertes 48hs antes.',
          'Informar si se están usando ácidos, retinoides u otros tratamientos dermatológicos.',
        ],
        post: [
          'Uso obligatorio de protector solar los días siguientes.',
          'Evitar exposición solar directa durante 48-72hs.',
          'No usar exfoliantes ni ácidos fuertes por unos días.',
          'Mantener la piel hidratada con los productos indicados.',
        ],
      },
      conditions: [
        'Piel muy sensible o reactiva.',
        'Irritación, inflamación o lesiones activas.',
        'Alergias conocidas a ingredientes cosméticos.',
        'Tratamientos dermatológicos en curso.',
        'Embarazo o lactancia.',
        'Cualquier condición de salud dermatológica relevante.',
      ],
      actives: [
        { img: 'f270e7f1df', word: 'retinol 0.5%', text: 'Estimulación de colágeno y renovación celular acelerada' },
        { img: '206371df74', word: 'péptidos', text: 'Péptidos biomiméticos: señalización celular para síntesis de fibras estructurales' },
        { img: 'b1535029ed', word: 'factores de crecimiento', text: 'Regeneración tisular y reparación del ADN celular' },
        { img: '0a76ea2694', word: 'vitamina E', text: 'Antioxidante liposoluble y potenciador de activos' },
      ],
      faq: [
        ['¿A partir de qué edad conviene empezar?', 'Desde los 25-30 años como prevención, sin límite superior como tratamiento correctivo.'],
        ['¿Duele?', 'No, es un tratamiento no invasivo y relajante.'],
        ['¿Puedo maquillarme después?', 'Sí, se recomienda esperar unas horas y usar protector solar debajo del maquillaje.'],
        ['¿Cada cuánto tengo que repetirlo?', 'Se arma un plan inicial y luego mantenimiento mensual o bimestral.'],
      ],
    },
  },
  {
    slug: 'revitalizante-antioxidante',
    name: 'Revitalizante / antioxidante',
    tagline: 'Luminosidad y defensa antioxidante',
    meta: '60 min · $55.000',
    detail:
      'El principal aliado en este tratamiento es la vitamina C, utilizada en distintas fórmulas. Esta es un potente antioxidante que neutraliza radicales libres causados por la exposición al sol, contaminación y otros agresores, protegiendo la piel del estrés oxidativo y el envejecimiento prematuro. Este tratamiento deja la piel limpia, radiante y saludable, potenciando la producción de colágeno y unificando el tono. Finalmente, revisamos la rutina domiciliaria para optimizar los resultados a largo plazo.',
    cardImg: 'e7741f6b15',
    page: {
      hero: {
        img: 'e7741f6b15',
        title: [['facial\n', 0], ['revitalizante', 1]],
        desc: 'El principal aliado en este tratamiento es la vitamina C, un potente antioxidante que neutraliza radicales libres causados por el sol, la contaminación y otros agresores. Deja la piel limpia, radiante y saludable, potenciando el colágeno y unificando el tono.',
        duration: '60 min',
        plan: 'Según evaluación',
        price: '$55.000',
      },
      intro: {
        img: '5d155ad4a5',
        title: [['luz ', 0], ['propia', 1]],
        text: 'La vitamina C neutraliza los radicales libres, protege frente al estrés oxidativo y deja la piel más luminosa y pareja.',
      },
      process: [
        { img: '3c1afb6e36', title: 'Diagnóstico de la piel', text: 'Evaluamos el estado de tu piel y su nivel de luminosidad.' },
        { img: 'ed49301393', title: 'Limpieza profunda', text: 'Higiene y exfoliación suave para preparar la piel.' },
        { img: '6cba84ed4f', title: 'Peeling antioxidante', text: 'Renovación superficial que potencia la absorción de la vitamina C.' },
        { img: '6511677a9b', title: 'Vitamina C', text: 'Vitamina C en distintas fórmulas para neutralizar radicales libres.' },
        { img: 'df8d0edd8a', title: 'Masaje revitalizante', text: 'Estimula la circulación y aporta luminosidad inmediata.' },
        { img: '8d8acea469', title: 'Máscara y protección', text: 'Máscara hidratante y protector solar para sellar el resultado.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Piel ', 0], ['radiante', 1], [' en cada sesión.', 0]],
        rows: [
          ['Duración:', '60 minutos'],
          ['Plan inicial:', 'Según evaluación'],
          ['Frecuencia:', 'Cada 15 a 30 días, según indicación'],
          ['Mantenimiento:', 'Ideal en cada cambio de estación'],
        ],
      },
      care: {
        pre: [
          'Evitar la exposición solar intensa los días previos.',
          'No usar exfoliantes fuertes 48hs antes.',
          'Informar si usás ácidos, retinoides u otros tratamientos.',
        ],
        post: [
          'Usar protector solar todos los días.',
          'Evitar el sol directo durante 48hs.',
          'Mantener la piel hidratada.',
          'Continuar con la rutina luz en casa.',
        ],
      },
      conditions: [
        'Piel muy sensible o reactiva.',
        'Irritación o lesiones activas.',
        'Alergia conocida a la vitamina C u otros ingredientes.',
        'Tratamientos dermatológicos en curso.',
        'Embarazo o lactancia.',
        'Cualquier condición de salud dermatológica relevante.',
      ],
      actives: [
        { img: '45612dd9a0', word: 'vitamina C', text: 'Antioxidante que aporta luminosidad y estimula el colágeno.' },
        { img: '6ed3857a0e', word: 'ácido ferúlico', text: 'Estabiliza y potencia la acción de la vitamina C.' },
        { img: '0a76ea2694', word: 'vitamina E', text: 'Antioxidante que protege y cuida la barrera.' },
        { img: 'f270e7f1df', word: 'ácido hialurónico', text: 'Hidrata en profundidad y devuelve jugosidad.' },
      ],
      faq: [
        ['¿Cuándo se ven los resultados?', 'La luminosidad se nota desde la primera sesión y mejora con la continuidad.'],
        ['¿Sirve para pieles apagadas?', 'Sí, es ideal para pieles apagadas o expuestas al sol y la ciudad.'],
        ['¿Puedo hacerlo en verano?', 'Sí, siempre con protector solar diario.'],
        ['¿Qué rutina uso después?', 'La rutina luz es su continuación en casa: limpieza, Asthera Day y Asthera Night.'],
      ],
    },
  },
  {
    slug: 'higiene-facial-profunda',
    name: 'Higiene facial profunda',
    tagline: 'Piel limpia, luminosa y revitalizada',
    meta: '60 min · $45.000',
    detail:
      'Comenzamos con un diagnóstico del paciente. Y continuamos con una higiene facial profunda, incluye una limpieza completa de la piel con exfoliación y extracciones; utilizando productos específicos para cada tipo de piel, siendo estos de primera calidad. Con un resultado de una piel limpia, luminosa, saludable y revitalizada. Por último, nos ocupamos de revisar la rutina domiciliaria del paciente y hacer correcciones de ser necesario.',
    cardImg: '27ccb84fd1',
    page: {
      hero: {
        img: '27ccb84fd1',
        title: [['higiene ', 0], ['profunda', 1]],
        desc: 'Comenzamos con un diagnóstico y seguimos con una higiene facial profunda: limpieza completa con exfoliación y extracciones, con productos específicos y de primera calidad para cada tipo de piel.',
        duration: '60 min',
        plan: 'Mensual',
        price: '$45.000',
      },
      intro: {
        img: 'ed49301393',
        title: [['piel ', 0], ['limpia', 1]],
        text: 'Una piel limpia, luminosa, saludable y revitalizada, y una rutina en casa revisada y ajustada a lo que tu piel necesita.',
      },
      process: [
        { img: '3c1afb6e36', title: 'Diagnóstico de la piel', text: 'Evaluamos tu tipo de piel para elegir los productos adecuados.' },
        { img: 'ed49301393', title: 'Doble limpieza', text: 'Retiramos maquillaje, impurezas y sebo acumulado.' },
        { img: '6cba84ed4f', title: 'Exfoliación', text: 'Renovamos las células muertas para una piel más suave.' },
        { img: '6511677a9b', title: 'Vapor y extracciones', text: 'Abrimos los poros y extraemos comedones de forma cuidadosa.' },
        { img: 'df8d0edd8a', title: 'Máscara específica', text: 'Purificante, hidratante o calmante, según tu necesidad.' },
        { img: '8d8acea469', title: 'Rutina en casa', text: 'Revisamos tu rutina domiciliaria y la ajustamos si hace falta.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Una base ', 0], ['limpia', 1], [' para todo.', 0]],
        rows: [
          ['Duración:', '60 minutos'],
          ['Plan:', 'Sesión única o mensual'],
          ['Frecuencia:', 'Cada 30 días, según indicación'],
          ['Ideal para:', 'Base de cualquier tratamiento'],
        ],
      },
      care: {
        pre: [
          'Evitar exfoliantes y ácidos 48hs antes.',
          'Venir sin maquillaje si es posible.',
          'Informar si usás retinoides u otros tratamientos.',
        ],
        post: [
          'Evitar el maquillaje durante 12 a 24hs.',
          'No tocar la piel ni apretar granitos.',
          'Usar protector solar todos los días.',
          'Mantener la piel hidratada.',
        ],
      },
      conditions: [
        'Acné inflamatorio severo.',
        'Herpes activo.',
        'Heridas o irritación en la zona.',
        'Tratamiento con isotretinoína en curso.',
        'Alergias conocidas a ingredientes cosméticos.',
        'Cualquier condición de salud dermatológica relevante.',
      ],
      actives: [
        { img: '54627c604e', word: 'enzimas', text: 'Exfolian con suavidad y dejan la piel más lisa.' },
        { img: '09e3db32d4', word: 'arcillas', text: 'Purifican y regulan el exceso de sebo.' },
        { img: '5fe6fdc8b1', word: 'ácido hialurónico', text: 'Hidrata y devuelve confort a la piel.' },
        { img: '4cda87e4e7', word: 'aloe vera', text: 'Calma la piel después de las extracciones.' },
      ],
      faq: [
        ['¿Cada cuánto conviene hacerla?', 'Una vez por mes es ideal para mantener la piel limpia y en equilibrio.'],
        ['¿Duelen las extracciones?', 'Pueden ser un poco molestas, pero se hacen con cuidado y respetando tu piel.'],
        ['¿Puedo maquillarme después?', 'Te recomendamos esperar entre 12 y 24hs.'],
        ['¿Sirve para cualquier tipo de piel?', 'Sí, adaptamos productos y pasos a cada tipo de piel.'],
      ],
    },
  },
  {
    slug: 'microneedling-exosomas',
    name: 'Microneedling + exosomas',
    tagline: 'Regeneración profunda y progresiva',
    meta: '75 min · $95.000',
    detail:
      'Tratamiento de estimulación cutánea que mejora manchas, marcas de acné, líneas finas y textura irregular.\nActiva la regeneración natural de la piel y potencia la penetración de activos específicos.\nIdeal si buscás un cambio profundo y progresivo en la calidad de tu piel. Requiere evaluación previa.',
    cardImg: 'ed49301393',
    page: {
      hero: {
        img: 'ed49301393',
        title: [['microneedling +\n', 0], ['exosomas', 1]],
        desc: 'Tratamiento de estimulación cutánea que mejora manchas, marcas de acné, líneas finas y textura irregular. Activa la regeneración natural de la piel y potencia la penetración de activos específicos. Requiere evaluación previa.',
        duration: '75 min',
        plan: '3 a 6 sesiones',
        price: '$95.000',
      },
      intro: {
        img: '6cba84ed4f',
        title: [['regeneración ', 0], ['real', 1]],
        text: 'Microperforaciones controladas activan la producción natural de colágeno, y los exosomas potencian la reparación y la llegada de los activos.',
      },
      process: [
        { img: 'fee0468899', title: 'Evaluación previa', text: 'Requisito indispensable: evaluamos tu piel y definimos la profundidad del tratamiento.' },
        { img: 'ed49301393', title: 'Limpieza y antisepsia', text: 'Higiene profunda y desinfección de la zona a tratar.' },
        { img: '6cba84ed4f', title: 'Anestesia tópica', text: 'Crema anestésica para que la sesión sea cómoda.' },
        { img: '6511677a9b', title: 'Microneedling', text: 'Microperforaciones controladas que activan la regeneración natural de la piel.' },
        { img: 'df8d0edd8a', title: 'Exosomas', text: 'Potencian la reparación celular y la penetración de los activos.' },
        { img: '8d8acea469', title: 'Calma y protección', text: 'Máscara calmante y protector solar para cerrar la sesión.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Un cambio ', 0], ['profundo', 1], [' y progresivo.', 0]],
        rows: [
          ['Duración:', '75 minutos'],
          ['Plan inicial:', '3 a 6 sesiones'],
          ['Frecuencia:', 'Cada 4 a 6 semanas, según indicación'],
          ['Requisito:', 'Evaluación previa'],
        ],
      },
      care: {
        pre: [
          'Evitar el sol directo y el bronceado 2 semanas antes.',
          'Suspender retinoides y ácidos 5 a 7 días antes.',
          'No depilar ni exfoliar la zona los días previos.',
        ],
        post: [
          'No maquillarse durante 24 a 48hs.',
          'Evitar sol, pileta, sauna y ejercicio intenso por 48hs.',
          'No usar ácidos ni retinoides durante una semana.',
          'Protector solar e hidratación todos los días.',
        ],
      },
      conditions: [
        'Acné inflamado o infecciones en la zona.',
        'Herpes activo.',
        'Tendencia a formar queloides.',
        'Tratamiento con isotretinoína en curso o reciente.',
        'Embarazo o lactancia.',
        'Trastornos de la coagulación o anticoagulantes.',
      ],
      actives: [
        { img: '343c3c488a', word: 'exosomas', text: 'Potencian la regeneración y la reparación celular.' },
        { img: '026773b946', word: 'factores de crecimiento', text: 'Estimulan la síntesis de colágeno y elastina.' },
        { img: 'ad67de520f', word: 'ácido hialurónico', text: 'Hidrata y acompaña la recuperación de la piel.' },
        { img: '9bfd1eb1be', word: 'péptidos', text: 'Señalizan la reparación y mejoran la firmeza.' },
      ],
      faq: [
        ['¿Duele?', 'Usamos anestesia tópica, así que la sensación es tolerable.'],
        ['¿Cuándo se ven los resultados?', 'La piel mejora de forma progresiva: los cambios se notan a partir de las semanas y siguen con cada sesión.'],
        ['¿Cuánto tiempo queda roja la piel?', 'Suele haber enrojecimiento entre 24 y 48hs, similar a una leve quemadura solar.'],
        ['¿Por qué necesito evaluación previa?', 'Para confirmar que sea el tratamiento indicado y definir la profundidad adecuada para tu piel.'],
      ],
    },
  },
  {
    slug: 'dermaplaning',
    name: 'Dermaplaning',
    tagline: 'Textura lisa y glow inmediato',
    meta: '45 min · $45.000',
    detail:
      'Renovación que mejora la textura y aporta luminosidad inmediata.\nElimina células muertas y vello fino, dejando la piel más suave y uniforme.\nIdeal si buscás efecto glow y mejor absorción de productos: la piel se ve más prolija, lisa y radiante.',
    cardImg: '8d8acea469',
    page: {
      hero: {
        img: '8d8acea469',
        title: [['tratamiento\n', 0], ['dermaplaning', 1]],
        desc: 'Renovación que mejora la textura y aporta luminosidad inmediata. Elimina células muertas y vello fino, dejando la piel más suave y uniforme. Ideal si buscás efecto glow y mejor absorción de productos.',
        duration: '45 min',
        plan: 'Sesión única',
        price: '$45.000',
      },
      intro: {
        img: '711ce5c7a3',
        title: [['efecto ', 0], ['glow', 1]],
        text: 'La piel se ve más prolija, lisa y radiante, y lista para absorber mejor tus productos.',
      },
      process: [
        { img: 'fee0468899', title: 'Diagnóstico de la piel', text: 'Confirmamos que el dermaplaning sea indicado para tu piel.' },
        { img: 'ed49301393', title: 'Doble limpieza', text: 'Retiramos maquillaje, sebo e impurezas.' },
        { img: '6cba84ed4f', title: 'Preparación', text: 'Secamos y tensamos la piel para trabajar de forma segura.' },
        { img: '6511677a9b', title: 'Dermaplaning', text: 'Con bisturí estéril retiramos células muertas y vello fino en pasadas suaves.' },
        { img: 'df8d0edd8a', title: 'Activos', text: 'Aprovechamos la mejor absorción para aplicar sérums según tu necesidad.' },
        { img: '8d8acea469', title: 'Hidratación y protección', text: 'Máscara hidratante y protector solar para cerrar.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Glow ', 0], ['inmediato', 1], [' desde la primera sesión.', 0]],
        rows: [
          ['Duración:', '45 minutos'],
          ['Plan:', 'Sesión única'],
          ['Frecuencia:', 'Cada 3 a 4 semanas, según indicación'],
          ['Ideal para:', 'Antes de un evento o como complemento'],
        ],
      },
      care: {
        pre: [
          'Suspender ácidos y retinoides 5 a 7 días antes.',
          'Evitar la exposición solar intensa los días previos.',
          'No depilar ni exfoliar el rostro una semana antes.',
        ],
        post: [
          'Maquillarse recién a partir de las 24hs.',
          'Usar protector solar todos los días.',
          'Evitar exfoliantes y ácidos por unos días.',
          'Limpiar la piel con suavidad, sin frotar.',
        ],
      },
      conditions: [
        'Acné activo.',
        'Herpes activo.',
        'Rosácea o piel muy reactiva.',
        'Eczema o heridas en la zona.',
        'Tratamiento con isotretinoína reciente.',
        'Peeling químico reciente.',
      ],
      actives: [
        { img: '0ac1b5d1e2', word: 'exfoliación', text: 'Retira las células muertas y deja la piel lisa.' },
        { img: 'eef49877ab', word: 'vello fino', text: 'Se elimina y vuelve a crecer igual, no más grueso.' },
        { img: 'ec853d6969', word: 'absorción', text: 'Los productos penetran mejor en una piel renovada.' },
        { img: 'b56b3c9b49', word: 'glow', text: 'Luminosidad inmediata, ideal antes de un evento.' },
      ],
      faq: [
        ['¿El vello crece más grueso?', 'No. El vello fino vuelve a crecer igual que antes.'],
        ['¿Duele?', 'No. Es un tratamiento suave e indoloro.'],
        ['¿Puedo maquillarme el mismo día?', 'Te recomendamos esperar 24hs.'],
        ['¿Se puede combinar con otros tratamientos?', 'Sí, potencia la absorción de activos y se puede sumar a otros protocolos.'],
      ],
    },
  },
  {
    slug: 'hidralips',
    name: 'Hidralips',
    tagline: 'Labios hidratados, sin volumen artificial',
    meta: '45 min · $40.000',
    detail:
      'Hidratación profunda para labios secos, agrietados o sin vitalidad.\nTrabajo con ácido hialurónico concentrado y estéril para mejorar la textura y devolver suavidad sin aportar volumen artificial.\nEs ideal para agregar a todos los tratamientos.',
    cardImg: '458d2dfa0a',
    page: {
      hero: {
        img: '458d2dfa0a',
        title: [['tratamiento\n', 0], ['hidralips', 1]],
        desc: 'Hidratación profunda para labios secos, agrietados o sin vitalidad. Trabajo con ácido hialurónico concentrado y estéril para mejorar la textura y devolver suavidad sin aportar volumen artificial. Es ideal para agregar a todos los tratamientos.',
        duration: '45 min',
        plan: 'Según evaluación',
        price: '$40.000',
      },
      intro: {
        img: 'ff4404e46b',
        title: [['labios ', 0], ['suaves', 1]],
        text: 'Mejoramos la textura y devolvemos la suavidad a tus labios, sin aportar volumen artificial.',
      },
      process: [
        { img: 'fee0468899', title: 'Evaluación', text: 'Observamos el estado de tus labios: sequedad, grietas y textura.' },
        { img: 'ed49301393', title: 'Limpieza', text: 'Higiene suave de la zona.' },
        { img: '6cba84ed4f', title: 'Exfoliación', text: 'Retiramos las pieles secas para preparar los labios.' },
        { img: '6511677a9b', title: 'Ácido hialurónico', text: 'Ácido hialurónico concentrado y estéril que hidrata en profundidad.' },
        { img: 'df8d0edd8a', title: 'Masaje', text: 'Maniobras suaves que distribuyen y favorecen la absorción.' },
        { img: '8d8acea469', title: 'Sellado', text: 'Bálsamo reparador para sellar la hidratación.' },
      ],
      duration: {
        img: '6511677a9b',
        phrase: [['Labios ', 0], ['hidratados,', 1], [' sin volumen.', 0]],
        rows: [
          ['Duración:', '45 minutos'],
          ['Plan:', 'Según evaluación'],
          ['Frecuencia:', 'Según indicación profesional'],
          ['Combinable:', 'Con cualquier tratamiento'],
        ],
      },
      care: {
        pre: [
          'Evitar exfoliar los labios los días previos.',
          'Informar si tenés tendencia al herpes labial.',
          'Venir sin maquillaje en los labios.',
        ],
        post: [
          'No usar labiales ni maquillaje durante 24hs.',
          'Mantener los labios hidratados con el bálsamo indicado.',
          'Evitar comidas muy calientes o picantes el primer día.',
          'Usar protección solar labial.',
        ],
      },
      conditions: [
        'Herpes labial activo.',
        'Heridas o lesiones en los labios.',
        'Alergia conocida al ácido hialurónico.',
        'Embarazo o lactancia.',
        'Tratamientos dermatológicos en curso.',
        'Cualquier condición de salud relevante.',
      ],
      actives: [
        { img: '98868ea0f7', word: 'ácido hialurónico', text: 'Retiene el agua y devuelve hidratación y suavidad.' },
        { img: '0a76ea2694', word: 'vitamina E', text: 'Antioxidante que protege y repara.' },
        { img: '45612dd9a0', word: 'pantenol', text: 'Calma y repara los labios agrietados.' },
        { img: '206371df74', word: 'manteca de karité', text: 'Nutre y sella la hidratación.' },
      ],
      faq: [
        ['¿Aumenta el volumen de los labios?', 'No. Mejora la hidratación y la textura, sin aportar volumen artificial.'],
        ['¿Duele?', 'Es un tratamiento suave y bien tolerado.'],
        ['¿Cuánto dura el efecto?', 'Depende de cada piel y de los cuidados en casa. Lo evaluamos en la sesión.'],
        ['¿Lo puedo sumar a otro tratamiento?', 'Sí, es ideal para agregar a cualquier tratamiento.'],
      ],
    },
  },
];

export const findTreatment = (slug: string | undefined) => treatments.find((t) => t.slug === slug);
