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

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export interface ImageData {
  url: string;
  publicId: string;
  width: number;
  height: number;
  order: number;
}

export interface UploadOptions {
  folder?: "properties" | "avatars" | "floor-plans" | "documents";
  propertyId?: string;
  maxSize?: number;
  allowedFormats?: string[];
}
