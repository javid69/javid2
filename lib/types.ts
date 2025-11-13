export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
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
  featured: boolean;
  amenities: string[];
  images: string[];
  agentId: string;
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
