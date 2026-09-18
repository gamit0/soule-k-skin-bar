import { Cocktail } from "@/types";
import { mockProducts } from "./products";

export const mockCocktails: Cocktail[] = [
  {
    "id": "cocktail-oil-control",
    "slug": "oil-control",
    "name": "Oil Control",
    "menuTitle": "COCKTAIL OIL CONTROL",
    "subtitle": "Brillo + Sebo + Poros",
    "description": "Rutina purificante y matificante para balancear el exceso de sebo sin alterar la hidratación esencial.",
    "icon": "🧊",
    "mood": "Clean",
    "concerns": [
      "oiliness",
      "pores",
      "acne"
    ],
    "skinTypes": [
      "oily",
      "combination"
    ],
    "productIds": [
      "prod_001",
      "prod_030",
      "prod_119"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_001",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_030",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "PROTEGE",
        "productId": "prod_119",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 927.0,
    "products": [
      {
        "id": "prod_001",
        "slug": "anua-heartleaf-quercetinol-pore-deep-cleansing-foam-150-ml",
        "name": "HEARTLEAF QUERCETINOL PORE DEEP CLEANSING FOAM 150 ML",
        "brand": "ANUA",
        "description": "Espuma limpiadora enriquecida con polvo de planta camaleón para eliminar las células muertas de la piel y purificar los poros. La fórmula granulada está infusionada con glicerina para hidratar la piel y ácido salicílico para proporcionar cuidado de los poros y efectos antiacné. Recomendada para pieles propensas al acné.",
        "shortDescription": "Espuma limpiadora enriquecida con polvo de planta camaleón para eliminar las células muertas de la piel y purificar los poros. La fórmula granulada está infusio...",
        "price": 299.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "acne",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Heartleaf"
        ],
        "benefits": [
          "Acne",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 1
      },
      {
        "id": "prod_030",
        "slug": "anua-niacinamide-10-txa-4-serum-30-ml",
        "name": "NIACINAMIDE 10% + TXA 4% SERUM 30 ml",
        "brand": "ANUA",
        "description": "Con una poderosa combinación iluminadora de 10% de niacinamida y 4% de ácido tranexámico, este serum se toma en serio la tarea de eliminar las manchas oscuras y las marcas post acné. Su fórmula sin fragancia y de textura no grasa ofrece beneficios agradables sin irritar las pieles mas temperamentales.",
        "shortDescription": "Con una poderosa combinación iluminadora de 10% de niacinamida y 4% de ácido tranexámico, este serum se toma en serio la tarea de eliminar las manchas oscuras y...",
        "price": 399.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "acne",
          "darkSpots",
          "dullness",
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Niacinamida"
        ],
        "benefits": [
          "Acne",
          "Darkspots",
          "Dullness",
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 16
      },
      {
        "id": "prod_119",
        "slug": "tocobo-algodon-suave-cotton-soft-sun-stick-19ml",
        "name": "Algodón Suave Cotton Soft Sun Stick 19ML",
        "brand": "TOCOBO",
        "description": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto de flor onagra vespertina y aceite de semilla de jojoba. El Protector Solar en Barra calma y controla el exceso de sebo en la piel con complejo de AC Herb. La formula contiene partículas pequeñas de polvo para dejar un acabado mate suave. Aplica la barra de protector solar portátil en el área de cara y cuerpo 30 minutos antes de exponerte al sol. Este producto es vegano y libre de crueldad animal.",
        "shortDescription": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto ...",
        "price": 229.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 65
      }
    ]
  },
  {
    "id": "cocktail-hydration",
    "slug": "hydration",
    "name": "Hydration",
    "menuTitle": "COCKTAIL HYDRATION",
    "subtitle": "Piel Seca + Deshidratación",
    "description": "Infusión de agua profunda con ácido hialurónico multicapa y protector solar hidratante.",
    "icon": "🌊",
    "mood": "Hydrated",
    "concerns": [
      "dehydration",
      "dullness"
    ],
    "skinTypes": [
      "dry",
      "combination",
      "sensitive",
      "normal"
    ],
    "productIds": [
      "prod_012",
      "prod_059",
      "prod_041",
      "prod_112"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_012",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_059",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_041",
        "usage": "BOTH"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_112",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1223.0,
    "products": [
      {
        "id": "prod_012",
        "slug": "round-lab-1025-dokdo-cleansera-150-ml",
        "name": "1025 DOKDO CLEANSERA 150 ML",
        "brand": "ROUND LAB",
        "description": "La espuma limpiadora elimina el residuo de maquillaje y las impurezas a fondo. Rebosante de agua pura de las profundidades marinas y ácidos hialurónicos, la formula mantiene la piel hidratada después de la limpieza mientras aporta minerales. Otros ingredientes como el pantenol, alantoides y ceramida NP forman una barrera protectora encima de la piel para sellar todo dentro consiguiendo una hidratación duradera y confortable.",
        "shortDescription": "La espuma limpiadora elimina el residuo de maquillaje y las impurezas a fondo. Rebosante de agua pura de las profundidades marinas y ácidos hialurónicos, la for...",
        "price": 199.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 6
      },
      {
        "id": "prod_059",
        "slug": "torriden-dive-in-low-molecular-hyaluronic-acid-serum-50-ml",
        "name": "DIVE-IN LOW MOLECULAR HYALURONIC ACID SERUM 50 ML",
        "brand": "TORRIDEN",
        "description": "Sérum ligero y potente, repleto de ácido hialurónico de 5D- Complex que se absorbe rápidamente para hidratar instantáneamente la piel. Ingredientes adicionales como pantenol, alantoína y madecassoside calman eficazmente la piel. El color azul pastel del sérum se deriva naturalmente del extracto de malaquita que fortifica la barrera cutánea. Después de limpiar y tonificar la piel, toma de 3 a 5 gotas del sérum y aplícalas suavemente sobre todo el rostro",
        "shortDescription": "Sérum ligero y potente, repleto de ácido hialurónico de 5D- Complex que se absorbe rápidamente para hidratar instantáneamente la piel. Ingredientes adicionales ...",
        "price": 399.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Ácido Hialurónico",
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 33
      },
      {
        "id": "prod_041",
        "slug": "isntree-serum-de-acido-hialuronico-ultra-low-molecular-hyaluronic-acid-serum-50-ml",
        "name": "Sérum de Ácido Hialurónico Ultra-Low Molecular Hyaluronic Acid Serum 50 ML",
        "brand": "ISNTREE",
        "description": "Sérum infundido con agua de mar profunda rica en minerales de la isla de Ulleung, Corea, que ayuda a revitalizar tu piel. Contiene 14 tipos de ácido hialurónico que restauran la hidratación de tu piel y refuerzan su barrera protectora. La combinación de gliceryl glucósido y madecassoside garantiza una hidratación duradera y un cuidado antiinflamatorio. La fórmula ligera se absorbe rápidamente en la piel para dejarla hidratada y refrescada al instante.",
        "shortDescription": "Sérum infundido con agua de mar profunda rica en minerales de la isla de Ulleung, Corea, que ayuda a revitalizar tu piel. Contiene 14 tipos de ácido hialurónico...",
        "price": 310.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Ácido Hialurónico"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 23
      },
      {
        "id": "prod_112",
        "slug": "dr-althea-protector-solar-aqua-glowing-sunscreen-45ml",
        "name": "Protector Solar Aqua Glowing Sunscreen 45ML",
        "brand": "DR. ALTHEA",
        "description": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de algas marinas para hidratar y reparar la barrera cutánea. También está enriquecido con pantenol para calmar la piel irritada. Apto para todo tipo de piel, incluidas las pieles sensibles y secas. .",
        "shortDescription": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de alga...",
        "price": 315.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "dry",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "dehydration"
        ],
        "ingredients": [
          "PDRN",
          "Pantenol"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 62
      }
    ]
  },
  {
    "id": "cocktail-glow",
    "slug": "glow",
    "name": "Glow",
    "menuTitle": "COCKTAIL GLOW",
    "subtitle": "Luminosidad + Glass Skin",
    "description": "Rutina iluminadora a base de arroz fermentado y alfa-arbutina para un acabado radiante y uniforme.",
    "icon": "🌟",
    "mood": "Glow",
    "concerns": [
      "dullness",
      "darkSpots"
    ],
    "skinTypes": [
      "normal",
      "combination",
      "dry"
    ],
    "productIds": [
      "prod_003",
      "prod_094",
      "prod_031",
      "prod_108"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_003",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_094",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_031",
        "usage": "BOTH"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_108",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1177.0,
    "products": [
      {
        "id": "prod_003",
        "slug": "beauty-of-joseon-green-plum-refreshing-cleanser-100-ml",
        "name": "GREEN PLUM REFRESHING CLEANSER 100 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Limpiador facial multiusos infundido con agua de ciruela, extracto de semilla de frijol mungo y hierbas nutritivas, que exfolia suavemente mientras brinda una limpieza profunda. Con una textura en gel ligera que deja la piel hidratada. Su fórmula con pH equilibrado es ideal para pieles sensibles.",
        "shortDescription": "Limpiador facial multiusos infundido con agua de ciruela, extracto de semilla de frijol mungo y hierbas nutritivas, que exfolia suavemente mientras brinda una l...",
        "price": 250.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "dry",
          "sensitive"
        ],
        "concerns": [
          "dehydration",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Dehydration",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 2
      },
      {
        "id": "prod_094",
        "slug": "anua-rice-70-glow-milky-toner-150-ml",
        "name": "RICE 70 GLOW MILKY TONER 150 ML",
        "brand": "ANUA",
        "description": "Tónico altamente hidratante que contiene un 77% de extracto de houttuynia cordata junto con otros once ingredientes aprobados por el Environmental Working Group (EWG) para calmar y proteger la piel sensible. Su pH ligeramente ácido también ayuda a regular los niveles de sebo y humedad de la piel.",
        "shortDescription": "Tónico altamente hidratante que contiene un 77% de extracto de houttuynia cordata junto con otros once ingredientes aprobados por el Environmental Working Group...",
        "price": 299.0,
        "category": "TONICO",
        "routineStep": "toner",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 51
      },
      {
        "id": "prod_031",
        "slug": "beauty-of-joseon-glow-deep-serum-rice-alpha-arbutin-60ml",
        "name": "GLOW DEEP SERUM: RICE +ALPHA-ARBUTIN 60ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Restaura el glow natural de una piel que luce cansada con este sérum iluminador que contiene 68.6% de agua arroz para aclarar la piel y 2% de arbutin para desvanecer la hiperpigmentación. Textura ligera que se absorbe rápidamente penetra profundamente en la piel para dar un brillo a la piel de larga duración y efectos hidratantes. Formulado sin aceites minerales, aceites esenciales, parabenos, sulfatos y PEG, este producto es apto pieles sensibles.",
        "shortDescription": "Restaura el glow natural de una piel que luce cansada con este sérum iluminador que contiene 68.6% de agua arroz para aclarar la piel y 2% de arbutin para desva...",
        "price": 329.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "dehydration",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Dehydration",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 17
      },
      {
        "id": "prod_108",
        "slug": "beauty-of-joseon-protector-solar-relief-sun-aqua-fresh-150-ml",
        "name": "Protector Solar Relief Sun Aqua-fresh 150 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol para dejar la piel calmada y fresca. El protector solar FPS 50+ PA++++ utiliza filtros químicos para proteger la piel del daño solar, sin dejar rastro blanco ni sensación pegajosa. Solo aplícalo generosamente y siéntete cómodamente lista para el sol.",
        "shortDescription": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol pa...",
        "price": 299.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 60
      }
    ]
  },
  {
    "id": "cocktail-calm",
    "slug": "calm",
    "name": "Calm",
    "menuTitle": "COCKTAIL CALM",
    "subtitle": "Sensibilidad + Rojeces",
    "description": "Terapia calmante con Heartleaf 77% y espuma Soon Jung para pieles reactivas y con rojez.",
    "icon": "☁️",
    "mood": "Calm",
    "concerns": [
      "sensitive",
      "redness"
    ],
    "skinTypes": [
      "sensitive",
      "combination",
      "dry"
    ],
    "productIds": [
      "prod_007",
      "prod_093",
      "prod_112"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_007",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_093",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "PROTEGE",
        "productId": "prod_112",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 954.0,
    "products": [
      {
        "id": "prod_007",
        "slug": "etude-espuma-limpiadora-soon-jung-whip-cleanser-renewal-150-ml",
        "name": "ESPUMA LIMPIADORA SOON JUNG WHIP CLEANSER RENEWAL 150 ML",
        "brand": "ETUDE",
        "description": "Espuma limpiadora formulada con ingredientes naturales y sin parabenos, fragancias ni colorantes artificiales. Su fórmula de pH bajo incorpora pantenol para hidratar la piel y madecassoside derivado de la centella asiática para combatir los problemas.",
        "shortDescription": "Espuma limpiadora formulada con ingredientes naturales y sin parabenos, fragancias ni colorantes artificiales. Su fórmula de pH bajo incorpora pantenol para hid...",
        "price": 240.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Centella Asiática",
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 4
      },
      {
        "id": "prod_093",
        "slug": "anua-heartleaf-77-soothing-toner-255-ml",
        "name": "HEARTLEAF 77% SOOTHING TONER 255 ML",
        "brand": "ANUA",
        "description": "Tónico altamente hidratante que contiene un 77% de extracto de houttuynia cordata junto con otros once ingredientes aprobados por el Environmental Working Group (EWG) para calmar y proteger la piel sensible. Su pH ligeramente ácido también ayuda a regular los niveles de sebo y humedad de la piel.",
        "shortDescription": "Tónico altamente hidratante que contiene un 77% de extracto de houttuynia cordata junto con otros once ingredientes aprobados por el Environmental Working Group...",
        "price": 399.0,
        "category": "TONICO",
        "routineStep": "toner",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "oiliness"
        ],
        "ingredients": [
          "Heartleaf"
        ],
        "benefits": [
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 51
      },
      {
        "id": "prod_112",
        "slug": "dr-althea-protector-solar-aqua-glowing-sunscreen-45ml",
        "name": "Protector Solar Aqua Glowing Sunscreen 45ML",
        "brand": "DR. ALTHEA",
        "description": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de algas marinas para hidratar y reparar la barrera cutánea. También está enriquecido con pantenol para calmar la piel irritada. Apto para todo tipo de piel, incluidas las pieles sensibles y secas. .",
        "shortDescription": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de alga...",
        "price": 315.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "dry",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "dehydration"
        ],
        "ingredients": [
          "PDRN",
          "Pantenol"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 62
      }
    ]
  },
  {
    "id": "cocktail-clear-skin",
    "slug": "clear-skin",
    "name": "Clear Skin",
    "menuTitle": "COCKTAIL CLEAR SKIN",
    "subtitle": "Brotes + Imperfecciones",
    "description": "Control antibacteriano y desinflamante con ácido azelaico y centella Tea-Trica.",
    "icon": "🫧",
    "mood": "Clean",
    "concerns": [
      "acne",
      "oiliness",
      "pores"
    ],
    "skinTypes": [
      "oily",
      "combination",
      "sensitive"
    ],
    "productIds": [
      "prod_001",
      "prod_027",
      "prod_055",
      "prod_119"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_001",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_027",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_055",
        "usage": "BOTH"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_119",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1192.0,
    "products": [
      {
        "id": "prod_001",
        "slug": "anua-heartleaf-quercetinol-pore-deep-cleansing-foam-150-ml",
        "name": "HEARTLEAF QUERCETINOL PORE DEEP CLEANSING FOAM 150 ML",
        "brand": "ANUA",
        "description": "Espuma limpiadora enriquecida con polvo de planta camaleón para eliminar las células muertas de la piel y purificar los poros. La fórmula granulada está infusionada con glicerina para hidratar la piel y ácido salicílico para proporcionar cuidado de los poros y efectos antiacné. Recomendada para pieles propensas al acné.",
        "shortDescription": "Espuma limpiadora enriquecida con polvo de planta camaleón para eliminar las células muertas de la piel y purificar los poros. La fórmula granulada está infusio...",
        "price": 299.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "acne",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Heartleaf"
        ],
        "benefits": [
          "Acne",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 1
      },
      {
        "id": "prod_027",
        "slug": "anua-azelaic-acid-10-hyaluron-redness-soothing-30ml",
        "name": "Azelaic Acid 10 Hyaluron Redness Soothing 30ML",
        "brand": "ANUA",
        "description": "Justo como el nombre lo dice, el sérum Anua Azelaic Acid esta aquí para suavizar tu piel roja e irritada. Este sérum ligero se caracteriza por un 10 de ácido azelaico, un ingrediente estrella para aliviar el acné, la rosácea y la hiperpigmentación, mientras el ácido hialurónico da una hidratación de larga duración. Su color verde viene del complejo calmante Gentle Calming Complex de Anua y sus ingredientes naturales incluyendo agua de hoja de té verde, aloe y cica.",
        "shortDescription": "Justo como el nombre lo dice, el sérum Anua Azelaic Acid esta aquí para suavizar tu piel roja e irritada. Este sérum ligero se caracteriza por un 10 de ácido az...",
        "price": 315.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "acne",
          "dehydration"
        ],
        "ingredients": [
          "Ácido Hialurónico",
          "Ácido Azelaico"
        ],
        "benefits": [
          "Acne",
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 15
      },
      {
        "id": "prod_055",
        "slug": "skin1004-madagascar-centella-tea-trica-ampoule-100-ml",
        "name": "MADAGASCAR CENTELLA TEA-TRICA AMPOULE 100 ML",
        "brand": "SKIN1004",
        "description": "calma instantáneamente la piel irritada y los brotes de acné. Está enriquecida con ANTI-SEBUM P(HD) y extracto de flor de onagra para controlar la producción de sebo y minimizar los poros dilatados. La textura líquida ligera y refrescante se absorbe rápidamente en la piel sin dejar una sensación pegajosa.",
        "shortDescription": "calma instantáneamente la piel irritada y los brotes de acné. Está enriquecida con ANTI-SEBUM P(HD) y extracto de flor de onagra para controlar la producción de...",
        "price": 349.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "acne",
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Acne",
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 30
      },
      {
        "id": "prod_119",
        "slug": "tocobo-algodon-suave-cotton-soft-sun-stick-19ml",
        "name": "Algodón Suave Cotton Soft Sun Stick 19ML",
        "brand": "TOCOBO",
        "description": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto de flor onagra vespertina y aceite de semilla de jojoba. El Protector Solar en Barra calma y controla el exceso de sebo en la piel con complejo de AC Herb. La formula contiene partículas pequeñas de polvo para dejar un acabado mate suave. Aplica la barra de protector solar portátil en el área de cara y cuerpo 30 minutos antes de exponerte al sol. Este producto es vegano y libre de crueldad animal.",
        "shortDescription": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto ...",
        "price": 229.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 65
      }
    ]
  },
  {
    "id": "cocktail-pore-care",
    "slug": "pore-care",
    "name": "Pore Care",
    "menuTitle": "COCKTAIL PORE CARE",
    "subtitle": "Textura + Poros",
    "description": "Tratamiento intensivo con Zero Pore Pads, ampolla poremizing y limpieza profunda.",
    "icon": "🔬",
    "mood": "Clean",
    "concerns": [
      "pores",
      "texture",
      "oiliness"
    ],
    "skinTypes": [
      "oily",
      "combination"
    ],
    "productIds": [
      "prod_002",
      "prod_010",
      "prod_053",
      "prod_111"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_002",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_010",
        "usage": "PM"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_053",
        "usage": "BOTH"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_111",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1473.0,
    "products": [
      {
        "id": "prod_002",
        "slug": "anua-aceite-limpiador-heartleaf-pore-control-200-ml",
        "name": "ACEITE LIMPIADOR HEARTLEAF PORE CONTROL 200 ML",
        "brand": "ANUA",
        "description": "El limpiador es el primer paso esencial para limpiar la piel. Empieza las cosas con buen pie con el aceite limpiador Heartleaf Pore Control para limpiar en profundidad el maquillaje, protector solar y el exceso de sebo al final del día. Mezclado con el extracto calmante de houttuynia cordata y aceites ligeros incluyendo jojoba, oliva y semilla de uva, el aceite limpiador de Anua elimina suavemente las impurezas que obstruyen los poros sin arrastrar la hidratación de la piel. La textura sedosa se emulsiona en un enjuague lechoso con un acabado suave y refrescante que deja respirar a tus poros.",
        "shortDescription": "El limpiador es el primer paso esencial para limpiar la piel. Empieza las cosas con buen pie con el aceite limpiador Heartleaf Pore Control para limpiar en prof...",
        "price": 290.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "PM",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "dehydration",
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Heartleaf"
        ],
        "benefits": [
          "Dehydration",
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 1
      },
      {
        "id": "prod_010",
        "slug": "haruharu-wonder-zero-pore-pad-20-70-esponjas",
        "name": "ZERO PORE PAD 2.0 70 ESPONJAS",
        "brand": "HARUHARU WONDER",
        "description": "Solo necesitas unas cuantas pasadas de los Toner Pads Zero Pore Pad 2.0 de medicube, empapados con exfoliantes químicos como AHA y BHA, para mantener tus poros limpios y tu piel con un acabado impecable. El pantenol, la alantoína y el extracto de cica ayudan a calmar e hidratar la piel. Con el uso constante, pronto disfrutarás de una piel libre de puntos negros y granitos.",
        "shortDescription": "Solo necesitas unas cuantas pasadas de los Toner Pads Zero Pore Pad 2.0 de medicube, empapados con exfoliantes químicos como AHA y BHA, para mantener tus poros ...",
        "price": 469.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "PM",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "acne",
          "texture",
          "pores"
        ],
        "ingredients": [
          "BHA",
          "AHA",
          "Pantenol"
        ],
        "benefits": [
          "Acne",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 5
      },
      {
        "id": "prod_053",
        "slug": "skin1004-madagascar-centella-poremizing-fresh-ampoule-100-ml",
        "name": "MADAGASCAR CENTELLA POREMIZING FRESH AMPOULE 100 ML.",
        "brand": "SKIN1004",
        "description": "Este sérum elimina la suciedad, las células muertas y el exceso de sebo, al mismo tiempo que minimiza los poros. Tras su uso, la piel luce más limpia y refinada. Además, se siente y se ve calmada, hidratada y más joven gracias al Complejo Peptide‑ 9 con efecto antiedad.",
        "shortDescription": "Este sérum elimina la suciedad, las células muertas y el exceso de sebo, al mismo tiempo que minimiza los poros. Tras su uso, la piel luce más limpia y refinada...",
        "price": 399.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 29
      },
      {
        "id": "prod_111",
        "slug": "celimax-protector-solar-pore-dark-spot-brightening-care-50ml",
        "name": "Protector Solar Pore+ Dark Spot Brightening Care 50ML",
        "brand": "CELIMAX",
        "description": "Es un protector solar químico que Esta enriquecido con ácido tranexámico y niacinamida para tratar la hiperpigmentación y el tono de piel desigual, junto con pantenol para mantener los brotes bajo control. Esta formula ligera se absorbe rápido en la piel para un terminado libre de efecto blanco y no grasienta.",
        "shortDescription": "Es un protector solar químico que Esta enriquecido con ácido tranexámico y niacinamida para tratar la hiperpigmentación y el tono de piel desigual, junto con pa...",
        "price": 315.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "acne",
          "darkSpots",
          "dullness"
        ],
        "ingredients": [
          "Niacinamida",
          "Pantenol"
        ],
        "benefits": [
          "Acne",
          "Darkspots",
          "Dullness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 61
      }
    ]
  },
  {
    "id": "cocktail-even-tone",
    "slug": "even-tone",
    "name": "Even Tone",
    "menuTitle": "COCKTAIL EVEN TONE",
    "subtitle": "Manchas + Marcas",
    "description": "Fórmula unificadora antimanchas con Niacinamida 10% + TXA 4% y ampolla iluminadora de centella.",
    "icon": "🐚",
    "mood": "Glow",
    "concerns": [
      "darkSpots",
      "dullness"
    ],
    "skinTypes": [
      "normal",
      "combination",
      "dry",
      "oily"
    ],
    "productIds": [
      "prod_003",
      "prod_030",
      "prod_057",
      "prod_108"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_003",
        "usage": "BOTH"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_030",
        "usage": "BOTH"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_057",
        "usage": "BOTH"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_108",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1297.0,
    "products": [
      {
        "id": "prod_003",
        "slug": "beauty-of-joseon-green-plum-refreshing-cleanser-100-ml",
        "name": "GREEN PLUM REFRESHING CLEANSER 100 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Limpiador facial multiusos infundido con agua de ciruela, extracto de semilla de frijol mungo y hierbas nutritivas, que exfolia suavemente mientras brinda una limpieza profunda. Con una textura en gel ligera que deja la piel hidratada. Su fórmula con pH equilibrado es ideal para pieles sensibles.",
        "shortDescription": "Limpiador facial multiusos infundido con agua de ciruela, extracto de semilla de frijol mungo y hierbas nutritivas, que exfolia suavemente mientras brinda una l...",
        "price": 250.0,
        "category": "LIMPIADOR",
        "routineStep": "cleanser",
        "usage": "BOTH",
        "skinTypes": [
          "dry",
          "sensitive"
        ],
        "concerns": [
          "dehydration",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Dehydration",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 2
      },
      {
        "id": "prod_030",
        "slug": "anua-niacinamide-10-txa-4-serum-30-ml",
        "name": "NIACINAMIDE 10% + TXA 4% SERUM 30 ml",
        "brand": "ANUA",
        "description": "Con una poderosa combinación iluminadora de 10% de niacinamida y 4% de ácido tranexámico, este serum se toma en serio la tarea de eliminar las manchas oscuras y las marcas post acné. Su fórmula sin fragancia y de textura no grasa ofrece beneficios agradables sin irritar las pieles mas temperamentales.",
        "shortDescription": "Con una poderosa combinación iluminadora de 10% de niacinamida y 4% de ácido tranexámico, este serum se toma en serio la tarea de eliminar las manchas oscuras y...",
        "price": 399.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "acne",
          "darkSpots",
          "dullness",
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Niacinamida"
        ],
        "benefits": [
          "Acne",
          "Darkspots",
          "Dullness",
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 16
      },
      {
        "id": "prod_057",
        "slug": "skin1004-madagascar-centella-tone-brightening-capsule-ampoule-100-ml",
        "name": "MADAGASCAR CENTELLA TONE BRIGHTENING CAPSULE AMPOULE 100 ML",
        "brand": "SKIN1004",
        "description": "Ofrece una dosis concentrada de beneficios iluminadores, hidratantes y calmantes. Los extractos antiinflamatorios de centella trabajan en sinergia con niacinamida, ácido tranexámico y ácido 3-O-etil ascórbico para difuminar manchas oscuras e imperfecciones, mientras mantienen la piel calmada y equilibrada, con un acabado jugoso y radiante.",
        "shortDescription": "Ofrece una dosis concentrada de beneficios iluminadores, hidratantes y calmantes. Los extractos antiinflamatorios de centella trabajan en sinergia con niacinami...",
        "price": 349.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "BOTH",
        "skinTypes": [
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness"
        ],
        "ingredients": [
          "Niacinamida"
        ],
        "benefits": [
          "Darkspots",
          "Dullness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 31
      },
      {
        "id": "prod_108",
        "slug": "beauty-of-joseon-protector-solar-relief-sun-aqua-fresh-150-ml",
        "name": "Protector Solar Relief Sun Aqua-fresh 150 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol para dejar la piel calmada y fresca. El protector solar FPS 50+ PA++++ utiliza filtros químicos para proteger la piel del daño solar, sin dejar rastro blanco ni sensación pegajosa. Solo aplícalo generosamente y siéntete cómodamente lista para el sol.",
        "shortDescription": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol pa...",
        "price": 299.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 60
      }
    ]
  },
  {
    "id": "cocktail-age-well",
    "slug": "age-well",
    "name": "Age Well",
    "menuTitle": "COCKTAIL AGE WELL",
    "subtitle": "Firmeza + Prevención",
    "description": "Rutina pro-edad con Retinal Shot, complejo NAD+ y contorno de ojos con Ginseng + Retinal.",
    "icon": "⌛",
    "mood": "Firm",
    "concerns": [
      "aging",
      "texture"
    ],
    "skinTypes": [
      "normal",
      "dry",
      "combination"
    ],
    "productIds": [
      "prod_049",
      "prod_061",
      "prod_071",
      "prod_108"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "LIMPIA",
        "productId": "prod_049",
        "usage": "PM"
      },
      {
        "stepNumber": 2,
        "stepType": "PREPARA",
        "productId": "prod_061",
        "usage": "PM"
      },
      {
        "stepNumber": 3,
        "stepType": "TRATA",
        "productId": "prod_071",
        "usage": "PM"
      },
      {
        "stepNumber": 4,
        "stepType": "PROTEGE",
        "productId": "prod_108",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 1207.0,
    "products": [
      {
        "id": "prod_049",
        "slug": "purito-seoul-serum-retinol-retinal-2000-nad-30ml",
        "name": "Sérum Retinol Retinal 2000 NAD+ 30ML",
        "brand": "PURITO SEOUL",
        "description": "¿Buscas un sérum antiedad que combata las líneas finas y arrugas para lucir una piel más joven? El Sérum Retinol Retinal 2000 NAD+ de Purito SEOUL está enriquecido con retinol, retinal y NAD+, una combinación que ayuda a reafirmar la piel y potenciar su vitalidad. Su innovadora fórmula de doble textura se activa al agitar el envase, mezclando estos potentes ingredientes rejuvenecedores para maximizar sus beneficios. Además, deja un acabado hidratante y confortable sobre la piel.",
        "shortDescription": "¿Buscas un sérum antiedad que combata las líneas finas y arrugas para lucir una piel más joven? El Sérum Retinol Retinal 2000 NAD+ de Purito SEOUL está enriquec...",
        "price": 320.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "PM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "aging",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Retinal",
          "Retinol"
        ],
        "benefits": [
          "Aging",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 27
      },
      {
        "id": "prod_061",
        "slug": "celimax-serum-facial-the-vita-a-retinal-shot-tightening-booster-15-ml",
        "name": "Sérum Facial The Vita-A Retinal Shot Tightening Booster 15 ML",
        "brand": "CELIMAX",
        "description": "Un pequeño tubo del Retinal Shot Tightening Booster de celimax concentra mucha tecnología avanzada de skincare para ayudar a reducir esas arrugas. Este tratamiento antiedad combina 0.1% de retinal en tamaño nano con liposomas para cuidar suavemente los poros y mejorar la elasticidad. El pantenol y los péptidos de bajo peso molecular Matrixyl 3000 refuerzan el colágeno y la hidratación para una piel más firme y suave. El toque final es el ingrediente exclusivo de celimax, A-Shot™, compuesto por micropartículas que estimulan la piel y mejoran la absorción de los activos — ¡ese cosquilleo significa que está funcionando!",
        "shortDescription": "Un pequeño tubo del Retinal Shot Tightening Booster de celimax concentra mucha tecnología avanzada de skincare para ayudar a reducir esas arrugas. Este tratamie...",
        "price": 349.0,
        "category": "SERUM",
        "routineStep": "serum",
        "usage": "PM",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "dehydration",
          "aging",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Retinal",
          "Pantenol"
        ],
        "benefits": [
          "Dehydration",
          "Aging",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 34
      },
      {
        "id": "prod_071",
        "slug": "beauty-of-joseon-revive-eye-serum-ginseng-retinal-30-ml",
        "name": "REVIVE EYE SERUM GINSENG + RETINAL 30 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Su fórmula ligera y de rápida absorción aprovecha el extracto de raíz de ginseng para hidratar y revitalizar la piel, un complejo de retinal liposomal al 2% para suavizar visiblemente las líneas de expresión, y la niacinamida para mejorar la textura y el tono de la piel. Este sérum nutritivo es justo lo que necesitas para ayudar a suavizar, iluminar y revitalizar la delicada zona del contorno de ojo.",
        "shortDescription": "Su fórmula ligera y de rápida absorción aprovecha el extracto de raíz de ginseng para hidratar y revitalizar la piel, un complejo de retinal liposomal al 2% par...",
        "price": 239.0,
        "category": "OJERAS",
        "routineStep": "treatment",
        "usage": "PM",
        "skinTypes": [
          "dry"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "aging",
          "texture",
          "pores"
        ],
        "ingredients": [
          "Niacinamida",
          "Retinal"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Aging",
          "Texture",
          "Pores"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 39
      },
      {
        "id": "prod_108",
        "slug": "beauty-of-joseon-protector-solar-relief-sun-aqua-fresh-150-ml",
        "name": "Protector Solar Relief Sun Aqua-fresh 150 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol para dejar la piel calmada y fresca. El protector solar FPS 50+ PA++++ utiliza filtros químicos para proteger la piel del daño solar, sin dejar rastro blanco ni sensación pegajosa. Solo aplícalo generosamente y siéntete cómodamente lista para el sol.",
        "shortDescription": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol pa...",
        "price": 299.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 60
      }
    ]
  },
  {
    "id": "cocktail-spf",
    "slug": "spf-master",
    "name": "SPF Shield",
    "menuTitle": "COCKTAIL SPF",
    "subtitle": "Encuentra tu protector ideal",
    "description": "Selección de los mejores protectores solares coreanos: fluido, hidratante y en barra.",
    "icon": "🛡️",
    "mood": "Hydrated",
    "concerns": [
      "sunProtection",
      "dehydration"
    ],
    "skinTypes": [
      "all",
      "sensitive",
      "dry",
      "oily",
      "combination"
    ],
    "productIds": [
      "prod_112",
      "prod_108",
      "prod_119"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "PROTEGE",
        "productId": "prod_112",
        "usage": "AM"
      },
      {
        "stepNumber": 2,
        "stepType": "PROTEGE",
        "productId": "prod_108",
        "usage": "AM"
      },
      {
        "stepNumber": 3,
        "stepType": "PROTEGE",
        "productId": "prod_119",
        "usage": "AM"
      }
    ],
    "active": true,
    "totalPrice": 843.0,
    "products": [
      {
        "id": "prod_112",
        "slug": "dr-althea-protector-solar-aqua-glowing-sunscreen-45ml",
        "name": "Protector Solar Aqua Glowing Sunscreen 45ML",
        "brand": "DR. ALTHEA",
        "description": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de algas marinas para hidratar y reparar la barrera cutánea. También está enriquecido con pantenol para calmar la piel irritada. Apto para todo tipo de piel, incluidas las pieles sensibles y secas. .",
        "shortDescription": "Protege la piel de los dañinos rayos UV mientras aumenta su hidratación. Está formulado con agua de bambú, extracto de uva marina y PDRN vegano derivado de alga...",
        "price": 315.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "dry",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "dehydration"
        ],
        "ingredients": [
          "PDRN",
          "Pantenol"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 62
      },
      {
        "id": "prod_108",
        "slug": "beauty-of-joseon-protector-solar-relief-sun-aqua-fresh-150-ml",
        "name": "Protector Solar Relief Sun Aqua-fresh 150 ML",
        "brand": "BEAUTY OF JOSEON",
        "description": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol para dejar la piel calmada y fresca. El protector solar FPS 50+ PA++++ utiliza filtros químicos para proteger la piel del daño solar, sin dejar rastro blanco ni sensación pegajosa. Solo aplícalo generosamente y siéntete cómodamente lista para el sol.",
        "shortDescription": "Este protector es la versión extra hidratante del popular protector solar Relief Sun de la marca contiene agua de semilla de arroz, avena coloidal y pantenol pa...",
        "price": 299.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "dehydration"
        ],
        "ingredients": [
          "Pantenol"
        ],
        "benefits": [
          "Dehydration"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 60
      },
      {
        "id": "prod_119",
        "slug": "tocobo-algodon-suave-cotton-soft-sun-stick-19ml",
        "name": "Algodón Suave Cotton Soft Sun Stick 19ML",
        "brand": "TOCOBO",
        "description": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto de flor onagra vespertina y aceite de semilla de jojoba. El Protector Solar en Barra calma y controla el exceso de sebo en la piel con complejo de AC Herb. La formula contiene partículas pequeñas de polvo para dejar un acabado mate suave. Aplica la barra de protector solar portátil en el área de cara y cuerpo 30 minutos antes de exponerte al sol. Este producto es vegano y libre de crueldad animal.",
        "shortDescription": "Este protector solar híbrido de minerales y químicos en barra ofrece SPF 50+ PA++++ con protección UV. Hidrata la piel con ingredientes naturales como extracto ...",
        "price": 229.0,
        "category": "PROTECTOR SOLAR",
        "routineStep": "sunscreen",
        "usage": "AM",
        "skinTypes": [
          "oily",
          "combination"
        ],
        "concerns": [
          "oiliness"
        ],
        "ingredients": [
          "Extractos botánicos K-Beauty",
          "Activos dermatológicos coreanos"
        ],
        "benefits": [
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 65
      }
    ]
  },
  {
    "id": "cocktail-mask-club",
    "slug": "mask-club",
    "name": "Mask Club",
    "menuTitle": "COCKTAIL MASK CLUB",
    "subtitle": "Hoy quiero consentirme",
    "description": "Tratamiento de spa coreano en casa con mascarilla de biodermocolágeno y sheet masks botánicas.",
    "icon": "🕯️",
    "mood": "Glow",
    "concerns": [
      "dehydration",
      "dullness",
      "aging"
    ],
    "skinTypes": [
      "all",
      "dry",
      "combination",
      "sensitive",
      "normal"
    ],
    "productIds": [
      "prod_089",
      "prod_086"
    ],
    "steps": [
      {
        "stepNumber": 1,
        "stepType": "TRATA",
        "productId": "prod_089",
        "usage": "PM"
      },
      {
        "stepNumber": 2,
        "stepType": "TRATA",
        "productId": "prod_086",
        "usage": "PM"
      }
    ],
    "active": true,
    "totalPrice": 415.0,
    "products": [
      {
        "id": "prod_089",
        "slug": "biodance-bio-collagen-real-deep-mask-04-mascarillas",
        "name": "BIO-COLLAGEN REAL DEEP MASK 04 MASCARILLAS",
        "brand": "BIODANCE",
        "description": "Ofrece firmeza, hidratación y luminosidad en un solo tratamiento. Gracias a su fórmula con colágeno de bajo peso molecular, ácido hialurónico oligo, galactomyces y niacinamida, esta mascarilla de hidrogel en dos piezas se adapta cómodamente al rostro mientras duermes, cuidando y nutriendo tu piel en profundidad.",
        "shortDescription": "Ofrece firmeza, hidratación y luminosidad en un solo tratamiento. Gracias a su fórmula con colágeno de bajo peso molecular, ácido hialurónico oligo, galactomyce...",
        "price": 350.0,
        "category": "MASCARILLA",
        "routineStep": "special_care",
        "usage": "BOTH",
        "skinTypes": [
          "normal",
          "combination",
          "dry",
          "oily",
          "sensitive"
        ],
        "concerns": [
          "darkSpots",
          "dullness",
          "dehydration",
          "aging"
        ],
        "ingredients": [
          "Ácido Hialurónico",
          "Niacinamida"
        ],
        "benefits": [
          "Darkspots",
          "Dullness",
          "Dehydration",
          "Aging"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 48
      },
      {
        "id": "prod_086",
        "slug": "abib-gummy-sheet-mask-50ml",
        "name": "GUMMY SHEET MASK 50ML",
        "brand": "ABIB",
        "description": "Elige entre cuatro tipos de mascarillas de microfibra altamente adherentes para diferentes tipos de piel y necesidades. Versión Madecassoside Sticker protege la piel de agresiones externas, refuerza la barrera de hidratación y calma la piel cansada Versión Heartleaf Sticker calma la piel sensible, trata imperfecciones y elimina el exceso de sebo. Versión Milk Sticker proporciona hidratación profunda y nutrición, mejora la textura de la piel y uniformiza el tono. Versión Aqua Sticker hidrata la piel, mejora su elasticidad y deja un cutis claro y suave.",
        "shortDescription": "Elige entre cuatro tipos de mascarillas de microfibra altamente adherentes para diferentes tipos de piel y necesidades. Versión Madecassoside Sticker protege la...",
        "price": 65.0,
        "category": "MASCARILLA",
        "routineStep": "special_care",
        "usage": "BOTH",
        "skinTypes": [
          "oily",
          "combination",
          "sensitive"
        ],
        "concerns": [
          "dehydration",
          "aging",
          "texture",
          "pores",
          "oiliness"
        ],
        "ingredients": [
          "Heartleaf"
        ],
        "benefits": [
          "Dehydration",
          "Aging",
          "Texture",
          "Pores",
          "Oiliness"
        ],
        "stock": 10,
        "inStock": true,
        "active": true,
        "sourcePage": 47
      }
    ]
  }
];
