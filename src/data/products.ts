import type { ProductDTO } from '../dtos/product.dto'
import { imobiliaAdvertiser, auroraAdvertiser, marinaAdvertiser } from './advertisers'

const livingRoom = { src: '/images/living-room.jpg', alt: 'Sala de estar iluminada com sofá e decoração em tons naturais' }
const kitchen = { src: '/images/kitchen.jpg', alt: 'Cozinha integrada com bancada e armários planejados' }
const bedroom = { src: '/images/bedroom.jpg', alt: 'Quarto confortável com cama de casal e iluminação natural' }
const advertiser = imobiliaAdvertiser

// Dados ilustrativos, sem relação com imóveis ou anunciantes reais.
export const products: ProductDTO[] = [
  {
    id: 'casa-jardim-botanico', title: 'Casa Jardim Botânico', type: 'house', transaction: 'rent',
    price: 4500, condominiumFee: 0, propertyTax: 180, city: 'Curitiba', state: 'PR', neighborhood: 'Jardim Botânico',
    area: 180, bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
    description: 'Uma casa para desacelerar e aproveitar os pequenos momentos. Com ambientes amplos, muita luz natural e um jardim acolhedor, este imóvel reúne espaço e conforto para o dia a dia. A sala se conecta à área de jantar e à cozinha, criando um ambiente perfeito para receber. O bairro oferece ruas tranquilas e fácil acesso a parques, mercados e serviços.',
    amenities: ['Jardim privativo', 'Área de serviço', 'Cozinha planejada', 'Quintal', 'Aceita pets', 'Churrasqueira'],
    images: [{ src: '/images/house-garden.jpg', alt: 'Casa com fachada clara, jardim e entrada arborizada' }, livingRoom, kitchen, bedroom], advertiser,
  },
  {
    id: 'apartamento-batel', title: 'Apartamento Essência Batel', type: 'apartment', transaction: 'rent',
    price: 3200, condominiumFee: 580, propertyTax: 120, city: 'Curitiba', state: 'PR', neighborhood: 'Batel',
    area: 86, bedrooms: 2, bathrooms: 2, parkingSpaces: 1,
    description: 'Um apartamento que combina praticidade e aconchego. A sala integrada recebe luz natural e abre espaço para viver, trabalhar e receber com conforto. Localizado em um bairro com cafés, restaurantes e serviços por perto, é uma boa escolha para quem gosta de fazer parte da vida da cidade.',
    amenities: ['Varanda', 'Elevador', 'Portaria', 'Cozinha planejada', 'Área de serviço', 'Aceita pets'],
    images: [livingRoom, kitchen, bedroom], advertiser: auroraAdvertiser,
  },
  {
    id: 'casa-vista-serena', title: 'Casa Vista Serena', type: 'house', transaction: 'rent',
    price: 5800, condominiumFee: 350, propertyTax: 240, city: 'Curitiba', state: 'PR', neighborhood: 'Santa Felicidade',
    area: 240, bedrooms: 4, bathrooms: 3, parkingSpaces: 2,
    description: 'Espaço de sobra para criar boas memórias. Esta casa tem ambientes integrados, quartos confortáveis e uma área externa ideal para os finais de semana. O projeto valoriza a entrada de luz e a convivência, em uma região residencial cercada de natureza.',
    amenities: ['Jardim privativo', 'Churrasqueira', 'Quintal', 'Área de serviço', 'Suíte', 'Aceita pets'],
    images: [{ src: '/images/house-modern.jpg', alt: 'Casa contemporânea com fachada branca e jardim verde' }, livingRoom, bedroom, kitchen], advertiser: auroraAdvertiser,
  },
  {
    id: 'apartamento-luz-do-dia', title: 'Apartamento Luz do Dia', type: 'apartment', transaction: 'rent',
    price: 2400, condominiumFee: 420, propertyTax: 85, city: 'Curitiba', state: 'PR', neighborhood: 'Água Verde',
    area: 64, bedrooms: 2, bathrooms: 1, parkingSpaces: 1,
    description: 'Leve, iluminado e bem distribuído. Um apartamento pensado para uma rotina prática, com sala aconchegante, cozinha funcional e quartos tranquilos. A localização facilita o acesso ao transporte, ao comércio e a tudo que você precisa no dia a dia.',
    amenities: ['Elevador', 'Portaria', 'Área de serviço', 'Cozinha planejada'],
    images: [{ src: '/images/apartment.jpg', alt: 'Apartamento com sala clara, móveis de madeira e janelas amplas' }, kitchen, bedroom], advertiser,
  },
  {
    id: 'casa-refugio-verde', title: 'Casa Refúgio Verde', type: 'house', transaction: 'rent',
    price: 3900, condominiumFee: 0, propertyTax: 155, city: 'São José dos Pinhais', state: 'PR', neighborhood: 'Afonso Pena',
    area: 156, bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
    description: 'Uma casa acolhedora, com jardim e ambientes que convidam a ficar. A planta oferece uma boa separação entre a área social e os quartos. O quintal traz espaço para plantas, brincadeiras e momentos ao ar livre.',
    amenities: ['Quintal', 'Jardim privativo', 'Churrasqueira', 'Área de serviço', 'Aceita pets'],
    images: [{ src: '/images/house-cozy.jpg', alt: 'Casa acolhedora com varanda, gramado e árvores ao redor' }, livingRoom, kitchen, bedroom], advertiser: marinaAdvertiser,
  },
  {
    id: 'apartamento-horizonte', title: 'Apartamento Horizonte', type: 'apartment', transaction: 'rent',
    price: 4100, condominiumFee: 650, propertyTax: 160, city: 'Curitiba', state: 'PR', neighborhood: 'Cabral',
    area: 112, bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
    description: 'Vista aberta e ambientes bem resolvidos para viver com conforto. A sala espaçosa permite diferentes composições, e os quartos oferecem privacidade para toda a família. O condomínio fica próximo de serviços e áreas verdes.',
    amenities: ['Varanda', 'Elevador', 'Portaria', 'Suíte', 'Cozinha planejada', 'Área de serviço'],
    images: [{ src: '/images/apartment-bright.jpg', alt: 'Sala de apartamento com amplas janelas e decoração contemporânea' }, kitchen, bedroom], advertiser: auroraAdvertiser,
  },
  {
    id: 'casa-jardins-do-sul', title: 'Casa Jardins do Sul', type: 'house', transaction: 'rent',
    price: 6200, condominiumFee: 450, propertyTax: 280, city: 'Curitiba', state: 'PR', neighborhood: 'Campo Comprido',
    area: 265, bedrooms: 4, bathrooms: 3, parkingSpaces: 3,
    description: 'Um refúgio com espaço para viver do seu jeito. A casa reúne uma área social generosa, cozinha integrada e quartos confortáveis. O jardim e a área de lazer completam os espaços para aproveitar bons momentos em casa.',
    amenities: ['Jardim privativo', 'Churrasqueira', 'Suíte', 'Quintal', 'Área de serviço', 'Aceita pets'],
    images: [{ src: '/images/house-pool.jpg', alt: 'Casa com área externa, piscina e espaço de convivência' }, livingRoom, kitchen, bedroom], advertiser,
  },
  {
    id: 'apartamento-boa-vista', title: 'Apartamento Boa Vista', type: 'apartment', transaction: 'rent',
    price: 1900, condominiumFee: 310, propertyTax: 65, city: 'Curitiba', state: 'PR', neighborhood: 'Boa Vista',
    area: 58, bedrooms: 2, bathrooms: 1, parkingSpaces: 1,
    description: 'O essencial para uma vida mais leve. Um apartamento compacto e bem distribuído, com ambientes claros e uma localização prática. Ideal para quem procura um espaço acolhedor para começar um novo capítulo.',
    amenities: ['Elevador', 'Portaria', 'Área de serviço', 'Aceita pets'],
    images: [{ src: '/images/apartment-warm.jpg', alt: 'Sala acolhedora com sofá, plantas e tons de madeira' }, bedroom, kitchen], advertiser,
  },
  {
    id: 'casa-bosque', title: 'Casa Bosque das Araucárias', type: 'house', transaction: 'sale',
    price: 980000, condominiumFee: 0, propertyTax: 230, city: 'Curitiba', state: 'PR', neighborhood: 'Santa Felicidade',
    area: 210, bedrooms: 3, bathrooms: 3, parkingSpaces: 2,
    description: 'Uma casa espaçosa para escrever uma nova história. Com jardim, ambientes integrados e acabamentos em tons naturais, oferece conforto em uma região residencial tranquila. Os espaços externos convidam a aproveitar a vida ao ar livre.',
    amenities: ['Jardim privativo', 'Churrasqueira', 'Suíte', 'Quintal', 'Cozinha planejada', 'Aceita pets'],
    images: [{ src: '/images/house-modern.jpg', alt: 'Casa ampla de arquitetura contemporânea cercada de verde' }, livingRoom, kitchen, bedroom], advertiser: auroraAdvertiser,
  },
  {
    id: 'apartamento-vila-izar', title: 'Apartamento Vila Izar', type: 'apartment', transaction: 'sale',
    price: 540000, condominiumFee: 480, propertyTax: 130, city: 'Curitiba', state: 'PR', neighborhood: 'Água Verde',
    area: 82, bedrooms: 2, bathrooms: 2, parkingSpaces: 1,
    description: 'Ambientes claros, planta funcional e um endereço que aproxima você de tudo. O apartamento possui sala integrada, cozinha planejada e uma suíte confortável. Uma opção para quem quer construir uma rotina com mais praticidade.',
    amenities: ['Elevador', 'Portaria', 'Suíte', 'Cozinha planejada', 'Área de serviço'],
    images: [livingRoom, bedroom, kitchen], advertiser,
  },
  {
    id: 'casa-parque-das-flores', title: 'Casa Parque das Flores', type: 'house', transaction: 'sale',
    price: 720000, condominiumFee: 0, propertyTax: 160, city: 'São José dos Pinhais', state: 'PR', neighborhood: 'Centro',
    area: 165, bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
    description: 'Conforto e espaço em uma casa com personalidade. A área social acolhedora se conecta à cozinha, e o quintal oferece liberdade para criar o seu cantinho preferido. A região tem comércio e serviços para facilitar o dia a dia.',
    amenities: ['Quintal', 'Churrasqueira', 'Jardim privativo', 'Área de serviço', 'Aceita pets'],
    images: [{ src: '/images/house-garden.jpg', alt: 'Casa com jardim frontal e fachada em tons neutros' }, kitchen, livingRoom, bedroom], advertiser: marinaAdvertiser,
  },
  {
    id: 'apartamento-alto-cabral', title: 'Apartamento Alto Cabral', type: 'apartment', transaction: 'sale',
    price: 850000, condominiumFee: 620, propertyTax: 190, city: 'Curitiba', state: 'PR', neighborhood: 'Cabral',
    area: 118, bedrooms: 3, bathrooms: 2, parkingSpaces: 2,
    description: 'Um apartamento com amplitude, luz natural e espaço para receber. A planta valoriza a circulação entre os ambientes, com uma sala generosa e quartos reservados. Um lugar para viver bem em um bairro arborizado.',
    amenities: ['Varanda', 'Elevador', 'Portaria', 'Suíte', 'Área de serviço', 'Cozinha planejada'],
    images: [{ src: '/images/apartment-bright.jpg', alt: 'Apartamento espaçoso com sala de estar e luz natural' }, bedroom, kitchen], advertiser,
  },
  {
    id: 'casa-alameda-ipes', title: 'Casa Alameda dos Ipês', type: 'house', transaction: 'sale',
    price: 1180000, condominiumFee: 380, propertyTax: 260, city: 'Curitiba', state: 'PR', neighborhood: 'Cabral',
    area: 245, bedrooms: 4, bathrooms: 3, parkingSpaces: 2,
    description: 'Uma casa com ambientes amplos, luz natural e espaço para receber. A área social integrada se abre para o jardim, enquanto os quartos oferecem conforto e privacidade. A área externa completa o espaço para aproveitar a rotina e os finais de semana em família.',
    amenities: ['Jardim privativo', 'Churrasqueira', 'Suíte', 'Área de serviço', 'Cozinha planejada', 'Aceita pets'],
    images: [{ src: '/images/house-pool.jpg', alt: 'Casa com jardim e área externa de convivência, imagem ilustrativa' }, livingRoom, kitchen, bedroom], advertiser: auroraAdvertiser,
  },
  {
    id: 'lote-jardim-americas', title: 'Lote Jardim das Américas', type: 'land', transaction: 'rent',
    price: 1800, condominiumFee: 0, propertyTax: 85, city: 'Curitiba', state: 'PR', neighborhood: 'Jardim das Américas',
    area: 360, bedrooms: 0, bathrooms: 0, parkingSpaces: 0,
    description: 'Um espaço aberto para o seu próximo projeto. Lote plano de 360 m² em uma região com comércio e serviços próximos. A área possui acesso por rua asfaltada e infraestrutura no entorno. As possibilidades de uso devem ser confirmadas conforme o zoneamento e as regras do município.',
    amenities: ['Terreno plano', 'Rua asfaltada', 'Rede de água na rua', 'Rede elétrica na rua'],
    images: [
      { src: '/images/land-open.jpg', alt: 'Área aberta com vegetação baixa e vista para o horizonte, imagem ilustrativa' },
      { src: '/images/land-green.jpg', alt: 'Área verde ampla sob céu aberto, imagem ilustrativa' },
    ], advertiser,
  },
  {
    id: 'lote-afonso-pena', title: 'Lote Afonso Pena', type: 'land', transaction: 'rent',
    price: 2400, condominiumFee: 0, propertyTax: 110, city: 'São José dos Pinhais', state: 'PR', neighborhood: 'Afonso Pena',
    area: 650, bedrooms: 0, bathrooms: 0, parkingSpaces: 0,
    description: 'Amplitude e uma localização prática para tirar ideias do papel. Este lote de 650 m² oferece acesso fácil e espaço para diferentes projetos. Consulte as condições de locação e a viabilidade da atividade pretendida antes de contratar.',
    amenities: ['Terreno plano', 'Acesso por via pública', 'Rede elétrica na rua', 'Comércio próximo'],
    images: [
      { src: '/images/land-green.jpg', alt: 'Terreno aberto com gramado e vegetação ao redor, imagem ilustrativa' },
      { src: '/images/land-open.jpg', alt: 'Paisagem de área aberta, imagem ilustrativa' },
    ], advertiser,
  },
  {
    id: 'lote-bosque-araucarias', title: 'Lote Bosque das Araucárias', type: 'land', transaction: 'sale',
    price: 260000, condominiumFee: 0, propertyTax: 95, city: 'Curitiba', state: 'PR', neighborhood: 'Santa Felicidade',
    area: 450, bedrooms: 0, bathrooms: 0, parkingSpaces: 0,
    description: 'O começo de um projeto com a sua identidade. Lote de 450 m² em região residencial arborizada, com espaço para planejar sua futura casa. A implantação e a construção dependem da aprovação dos órgãos responsáveis e das regras de uso do solo.',
    amenities: ['Região residencial', 'Rua asfaltada', 'Rede de água na rua', 'Área arborizada'],
    images: [
      { src: '/images/land-green.jpg', alt: 'Área verde em região tranquila, imagem ilustrativa' },
      { src: '/images/land-open.jpg', alt: 'Vista ampla de terreno aberto, imagem ilustrativa' },
    ], advertiser,
  },
  {
    id: 'lote-campo-comprido', title: 'Lote Campo Comprido', type: 'land', transaction: 'sale',
    price: 390000, condominiumFee: 0, propertyTax: 140, city: 'Curitiba', state: 'PR', neighborhood: 'Campo Comprido',
    area: 600, bedrooms: 0, bathrooms: 0, parkingSpaces: 0,
    description: 'Mais espaço para construir novas possibilidades. Um lote de 600 m² com acesso à infraestrutura da região e serviços nas proximidades. Uma opção para planejar com calma o seu próximo endereço, respeitando o zoneamento e os parâmetros de construção locais.',
    amenities: ['Terreno plano', 'Rua asfaltada', 'Rede elétrica na rua', 'Serviços próximos'],
    images: [
      { src: '/images/land-open.jpg', alt: 'Terreno amplo com vegetação e céu aberto, imagem ilustrativa' },
      { src: '/images/land-green.jpg', alt: 'Área verde para ilustrar o anúncio do lote' },
    ], advertiser,
  },
]
