export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  phone?: string | null;
  bio?: string | null;
  agency?: string | null;
  licenseNumber?: string | null;
  yearsOfExp?: number | null;
  visible?: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  status: PropertyStatus;
  images: string[];
  views: number;
  featured: boolean;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  status: InquiryStatus;
  notes?: string | null;
  agentId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PropertyType {
  HOUSE = "HOUSE",
  APARTMENT = "APARTMENT",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  LAND = "LAND",
  COMMERCIAL = "COMMERCIAL",
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  SOLD = "SOLD",
  RENTED = "RENTED",
}

export enum InquiryStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}
