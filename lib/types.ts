export interface User {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
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
  category: PropertyCategory;
  status: PropertyStatus;
  approvalStatus: ApprovalStatus;
  isFeatured: boolean;
  featuredOrder?: number | null;
  images: string[];
  views: number;
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

export enum PropertyCategory {
  SALE = "SALE",
  RENT = "RENT",
  LEASE = "LEASE",
}

export enum PropertyStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SOLD = "SOLD",
  RENTED = "RENTED",
  INACTIVE = "INACTIVE",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum InquiryStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
}

export interface Inquiry {
  id: string;
  propertyId: string;
  userId?: string | null;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string | null;
  message: string;
  status: InquiryStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  platformName: string;
  platformTagline: string;
  companyEmail?: string | null;
  companyPhone?: string | null;
  companyAddress?: string | null;
  logoUrl?: string | null;
  enableRegistrations: boolean;
  enablePropertyCreation: boolean;
  enableInquiries: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  supportEmail?: string | null;
  noReplyEmail?: string | null;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
}
