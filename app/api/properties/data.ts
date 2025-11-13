import type { PropertyStatus } from "@/types/property";

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface Amenity {
  name: string;
  icon: string;
  included?: boolean;
}

export interface Landmark {
  name: string;
  distance: string;
  description?: string;
}

export interface TransitOption {
  type: string;
  value: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  whatsapp: string;
}

export interface Property {
  id: string;
  propertyId: string;
  title: string;
  slug: string;
  category: string;
  propertyType: string;
  price: number;
  status: PropertyStatus;
  address: string;
  location: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  description: string;
  descriptionHtml: string;
  highlights: string[];
  images: GalleryImage[];
  amenities: Amenity[];
  listedDate: string;
  updatedDate: string;
  agent: AgentInfo;
  shareUrl: string;
  videoUrl?: string;
  similarPropertyIds: string[];
  map: {
    summary: string;
    landmarks: Landmark[];
    transit: TransitOption[];
  };
  tags: string[];
  rating: number;
  views: number;
}

const properties: Property[] = [
  {
    id: "palm-harbour-villa",
    propertyId: "AV-2024-008",
    title: "Palm Harbour Waterfront Villa",
    slug: "palm-harbour-waterfront-villa",
    category: "Luxury Residential",
    propertyType: "Villa",
    price: 115000000,
    status: "Active",
    address: "Palm Harbour, Worli Sea Face",
    location: "Worli Sea Face, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400030",
    coordinates: {
      lat: 18.993768,
      lng: 72.817789,
    },
    bedrooms: 5,
    bathrooms: 6,
    area: 6200,
    yearBuilt: 2021,
    description:
      "A breathtaking 5-bedroom waterfront villa with panoramic views of the Arabian Sea. Designed by acclaimed architects, the villa offers seamless indoor-outdoor living with premium finishes throughout.",
    descriptionHtml:
      "<p>This spectacular waterfront villa combines cutting-edge architecture with timeless elegance. Floor-to-ceiling glass opens to expansive terraces, an infinity pool, and private cabanas overlooking the Arabian Sea. The gourmet kitchen features custom Italian cabinetry, professional-grade appliances, and a dedicated wine cellar.</p><p>Each bedroom is a private suite with spa-inspired bathrooms and walk-in wardrobes. Smart home automation controls lighting, climate, and security. The villa also includes a private theatre, fitness suite, and meditation deck surrounded by curated tropical landscaping.</p><p>Located in the most prestigious enclave of Worli, residents enjoy proximity to premium clubs, dining destinations, and the upcoming coastal road for seamless connectivity across Mumbai.</p>",
    highlights: [
      "Infinity-edge pool with Arabian Sea view",
      "Private dock with yacht access",
      "Smart home automation",
      "Sunrise and sunset terraces",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
        alt: "Palm Harbour Villa exterior with infinity pool overlooking the sea",
      },
      {
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb512?auto=format&fit=crop&w=1600&q=80",
        alt: "Modern living room with sea view",
      },
      {
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80",
        alt: "Luxury kitchen with marble finish",
      },
      {
        url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80",
        alt: "Bedroom suite with floor-to-ceiling glass",
      },
      {
        url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80",
        alt: "Spa-inspired bathroom with soaking tub",
      },
    ],
    amenities: [
      { name: "Infinity Pool", icon: "Waves" },
      { name: "Private Dock", icon: "Anchor" },
      { name: "Home Theatre", icon: "Film" },
      { name: "Smart Automation", icon: "Cpu" },
      { name: "24/7 Security", icon: "ShieldCheck" },
      { name: "Meditation Deck", icon: "Lotus" },
      { name: "Fitness Studio", icon: "Dumbbell" },
      { name: "Wine Cellar", icon: "Wine" },
      { name: "Chef's Kitchen", icon: "Utensils" },
      { name: "Private Elevator", icon: "Lift" },
      { name: "Landscaped Gardens", icon: "Flower" },
      { name: "Backup Power", icon: "BatteryCharging" },
    ],
    listedDate: "2024-01-15T10:30:00.000Z",
    updatedDate: "2024-03-10T15:45:00.000Z",
    agent: {
      id: "agent-jade",
      name: "Jade Malhotra",
      title: "Senior Luxury Specialist",
      phone: "+91 98765 43210",
      email: "jade.malhotra@asylenventures.com",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      whatsapp: "https://wa.me/919876543210",
    },
    shareUrl: "https://asylenventures.com/properties/palm-harbour-villa",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    similarPropertyIds: ["skyline-penthouse", "azure-bay-residence", "emerald-gardens"],
    map: {
      summary:
        "Located along Worli Sea Face with unrivalled access to the coastal road and the business districts of South Mumbai.",
      landmarks: [
        {
          name: "Worli Sea Face Promenade",
          distance: "150 m",
          description: "Iconic waterfront promenade for morning runs.",
        },
        {
          name: "Bandra-Worli Sea Link",
          distance: "1.8 km",
          description: "Quick access to Bandra and Western Suburbs.",
        },
        {
          name: "Four Seasons Hotel",
          distance: "2.1 km",
        },
      ],
      transit: [
        { type: "Airport", value: "35 min to Chhatrapati Shivaji International" },
        { type: "Metro", value: "10 min to Worli Metro Station" },
        { type: "Business District", value: "12 min to BKC" },
      ],
    },
    tags: ["waterfront", "villa", "luxury"],
    rating: 4.9,
    views: 1245,
  },
  {
    id: "skyline-penthouse",
    propertyId: "AV-2024-014",
    title: "Skyline Signature Penthouse",
    slug: "skyline-signature-penthouse",
    category: "Premium Residential",
    propertyType: "Penthouse",
    price: 62000000,
    status: "Active",
    address: "Skyline Residences, Lower Parel",
    location: "Lower Parel, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400013",
    coordinates: {
      lat: 18.9923,
      lng: 72.8241,
    },
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    yearBuilt: 2019,
    description:
      "Skyline Signature Penthouse offers 270-degree views of Mumbai's evolving skyline with double-height ceilings and bespoke interiors.",
    descriptionHtml:
      "<p>This exquisite penthouse spans two levels with an open-to-sky terrace featuring a heated plunge pool and outdoor lounge. The living areas are furnished with custom European pieces, integrating seamlessly with a fully-equipped show kitchen and a back-end chef station.</p><p>The master suite includes a private study, his and hers walk-in wardrobes, and a marble-clad ensuite with steam shower. Residents enjoy access to the Skyline Club, including a sky gym, infinity pool, and concierge services.</p>",
    highlights: [
      "Sky terrace with plunge pool",
      "Glass-enclosed study",
      "Dual kitchens",
      "Concierge services",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
        alt: "Penthouse living room with city skyline view",
      },
      {
        url: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=80",
        alt: "Open kitchen with marble island",
      },
      {
        url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
        alt: "Penthouse terrace with plunge pool",
      },
      {
        url: "https://images.unsplash.com/photo-1570129476769-55f4a5add5a6?auto=format&fit=crop&w=1600&q=80",
        alt: "Bedroom with skyline view",
      },
    ],
    amenities: [
      { name: "Plunge Pool", icon: "Waves" },
      { name: "Sky Lounge", icon: "Cloud" },
      { name: "Concierge", icon: "Headset" },
      { name: "Dual Kitchen", icon: "UtensilsCrossed" },
      { name: "Club Access", icon: "Diamond" },
      { name: "Private Study", icon: "BookOpen" },
      { name: "Steam Shower", icon: "Drop" },
      { name: "Valet Parking", icon: "Car" },
    ],
    listedDate: "2024-02-01T09:15:00.000Z",
    updatedDate: "2024-03-12T12:00:00.000Z",
    agent: {
      id: "agent-rahul",
      name: "Rahul Desai",
      title: "Vice President - Elite Homes",
      phone: "+91 99880 11223",
      email: "rahul.desai@asylenventures.com",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
      whatsapp: "https://wa.me/919988011223",
    },
    shareUrl: "https://asylenventures.com/properties/skyline-penthouse",
    similarPropertyIds: ["palm-harbour-villa", "azure-bay-residence"],
    map: {
      summary:
        "Nestled in Lower Parel with direct connection to lifestyle destinations, fine dining, and Grade-A offices.",
      landmarks: [
        { name: "Palladium Mall", distance: "500 m" },
        { name: "St. Regis Mumbai", distance: "450 m" },
        { name: "High Street Phoenix", distance: "350 m" },
      ],
      transit: [
        { type: "Metro", value: "5 min to Lower Parel Metro" },
        { type: "Rail", value: "7 min to Lower Parel Station" },
        { type: "Airport", value: "40 min to Airport" },
      ],
    },
    tags: ["penthouse", "cityscape", "premium"],
    rating: 4.8,
    views: 980,
  },
  {
    id: "azure-bay-residence",
    propertyId: "AV-2024-021",
    title: "Azure Bay Residence",
    slug: "azure-bay-residence",
    category: "Seaview Residences",
    propertyType: "Apartment",
    price: 38500000,
    status: "Active",
    address: "Azure Bay, Carter Road",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipCode: "400050",
    coordinates: {
      lat: 19.063447,
      lng: 72.826515,
    },
    bedrooms: 3,
    bathrooms: 4,
    area: 2350,
    yearBuilt: 2020,
    description:
      "Azure Bay is a boutique sea-facing development offering contemporary residences with expansive balconies and curated amenities.",
    descriptionHtml:
      "<p>The residence showcases a sun-drenched living room leading to a wide sea-facing balcony perfect for al fresco dining. The modular kitchen is equipped with Gaggenau appliances and a quartz island.</p><p>The master suite features a private lounge corner, walk-in wardrobe, and ensuite with rain shower and deep soaking tub. Residents have access to an exclusive rooftop clubhouse with infinity-edge lap pool.</p>",
    highlights: [
      "Sea-facing balcony",
      "Rooftop clubhouse",
      "Pet-friendly floors",
      "Dedicated concierge",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
        alt: "Living room with sea-facing balcony",
      },
      {
        url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80",
        alt: "Modern kitchen with island",
      },
      {
        url: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80",
        alt: "Bedroom with balcony view",
      },
      {
        url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
        alt: "Rooftop infinity pool",
      },
    ],
    amenities: [
      { name: "Rooftop Pool", icon: "Waves" },
      { name: "Concierge", icon: "Headset" },
      { name: "Pet Friendly", icon: "PawPrint" },
      { name: "EV Charging", icon: "BatteryCharging" },
      { name: "Spa", icon: "Spa" },
      { name: "Yoga Studio", icon: "StretchHorizontal" },
      { name: "Co-working", icon: "Briefcase" },
      { name: "Sky Lounge", icon: "CloudSun" },
    ],
    listedDate: "2023-12-22T11:20:00.000Z",
    updatedDate: "2024-03-18T09:30:00.000Z",
    agent: {
      id: "agent-sana",
      name: "Sana Kapoor",
      title: "Lead Property Advisor",
      phone: "+91 97000 55667",
      email: "sana.kapoor@asylenventures.com",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
      whatsapp: "https://wa.me/919700055667",
    },
    shareUrl: "https://asylenventures.com/properties/azure-bay-residence",
    similarPropertyIds: ["skyline-penthouse", "emerald-gardens"],
    map: {
      summary:
        "Set along Carter Road promenade with boutique cafes, performance spaces, and vibrant nightlife.",
      landmarks: [
        { name: "Carter Road Promenade", distance: "100 m" },
        { name: "Otters Club", distance: "250 m" },
        { name: "Pali Hill", distance: "650 m" },
      ],
      transit: [
        { type: "Airport", value: "25 min to Airport" },
        { type: "Metro", value: "8 min to Bandra Metro" },
        { type: "Rail", value: "12 min to Bandra Station" },
      ],
    },
    tags: ["sea-view", "family", "premium"],
    rating: 4.7,
    views: 832,
  },
  {
    id: "emerald-gardens",
    propertyId: "AV-2024-032",
    title: "Emerald Gardens Estate",
    slug: "emerald-gardens-estate",
    category: "Signature Estates",
    propertyType: "Bungalow",
    price: 45000000,
    status: "Active",
    address: "Emerald Gardens, Koregaon Park",
    location: "Koregaon Park, Pune",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    zipCode: "411001",
    coordinates: {
      lat: 18.5366,
      lng: 73.8933,
    },
    bedrooms: 4,
    bathrooms: 5,
    area: 5200,
    yearBuilt: 2018,
    description:
      "A contemporary estate nestled within a botanical sanctuary of mature rain trees, offering serenity minutes from Pune's urban core.",
    descriptionHtml:
      "<p>Emerald Gardens Estate is designed for multi-generational living with distinct private and social wings connected by landscaped courtyards. The central atrium brings in diffused light across the day, illuminating the art gallery corridor.</p><p>The estate includes a gourmet kitchen garden, temperature-controlled wine room, and a wellness pavilion with sauna and plunge pool. A dedicated work-from-nature studio overlooks the zen water feature.</p>",
    highlights: [
      "Private wellness pavilion",
      "Gourmet kitchen garden",
      "Art gallery corridor",
      "Work-from-nature studio",
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80",
        alt: "Estate exterior with lush gardens",
      },
      {
        url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80",
        alt: "Open living space overlooking courtyard",
      },
      {
        url: "https://images.unsplash.com/photo-1487611487982-897871e19b24?auto=format&fit=crop&w=1600&q=80",
        alt: "Zen wellness pavilion",
      },
      {
        url: "https://images.unsplash.com/photo-1530023367847-a683933f4177?auto=format&fit=crop&w=1600&q=80",
        alt: "Modern kitchen garden",
      },
    ],
    amenities: [
      { name: "Wellness Pavilion", icon: "Spa" },
      { name: "Wine Room", icon: "Wine" },
      { name: "Kitchen Garden", icon: "Sprout" },
      { name: "Solar Power", icon: "Sun" },
      { name: "Water Recycling", icon: "Droplets" },
      { name: "Guest House", icon: "Home" },
      { name: "Library", icon: "Book" },
      { name: "Outdoor Cinema", icon: "MonitorPlay" },
    ],
    listedDate: "2023-11-10T10:00:00.000Z",
    updatedDate: "2024-03-05T17:20:00.000Z",
    agent: {
      id: "agent-mihir",
      name: "Mihir Kulkarni",
      title: "Estate Specialist",
      phone: "+91 96200 77889",
      email: "mihir.kulkarni@asylenventures.com",
      avatar:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
      whatsapp: "https://wa.me/919620077889",
    },
    shareUrl: "https://asylenventures.com/properties/emerald-gardens",
    similarPropertyIds: ["azure-bay-residence", "palm-harbour-villa"],
    map: {
      summary:
        "Positioned in Koregaon Park's green corridor close to culinary hotspots and cultural venues.",
      landmarks: [
        { name: "Osho Garden", distance: "300 m" },
        { name: "Koregaon Park Plaza", distance: "700 m" },
        { name: "Airport", distance: "20 min" },
      ],
      transit: [
        { type: "IT Hub", value: "18 min to Magarpatta" },
        { type: "Airport", value: "20 min to Pune Airport" },
        { type: "Rail", value: "15 min to Pune Station" },
      ],
    },
    tags: ["estate", "garden", "wellness"],
    rating: 4.85,
    views: 921,
  },
];

export function getProperties() {
  return properties;
}

export function getPropertyById(id: string) {
  return properties.find((property) => property.id === id) ?? null;
}

export function getSimilarProperties(
  id: string,
  options?: {
    limit?: number;
  },
) {
  const current = getPropertyById(id);
  if (!current) {
    return [];
  }

  const limit = options?.limit ?? 6;
  const minPrice = current.price * 0.8;
  const maxPrice = current.price * 1.2;

  return properties
    .filter((property) => {
      if (property.id === id) return false;
      const inCategory = property.category === current.category;
      const inCity = property.city === current.city;
      const inPriceRange = property.price >= minPrice && property.price <= maxPrice;
      const isLinked = current.similarPropertyIds.includes(property.id);
      return inCategory || inCity || inPriceRange || isLinked;
    })
    .slice(0, limit);
}

export type PropertyStatusLabel = "Active" | "Sold" | "Rented" | "Pending";

export function getPropertyStatusLabel(status: Property["status"]) {
  switch (status) {
    case "Active":
      return "Active";
    case "Sold":
      return "Sold";
    case "Rented":
      return "Rented";
    case "Pending":
      return "Pending";
    default:
      return status;
  }
}
