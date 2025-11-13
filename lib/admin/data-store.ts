import { v4 as uuidv4 } from "uuid";
import {
  ApprovalStatus,
  InquiryStatus,
  PropertyCategory,
  PropertyStatus,
  UserRole,
  UserStatus,
} from "@/lib/types";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  propertiesCount: number;
  joinDate: string;
  lastActive: string;
};

type AdminProperty = {
  id: string;
  title: string;
  image: string;
  agentId: string;
  agentName: string;
  price: number;
  category: PropertyCategory;
  status: PropertyStatus;
  approvalStatus: ApprovalStatus;
  location: string;
  createdAt: string;
  views: number;
  isFeatured: boolean;
  featuredOrder?: number;
};

type AdminInquiry = {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  propertyId: string;
  propertyTitle: string;
  status: InquiryStatus;
  agentId?: string;
  agentName?: string;
  message: string;
  timeline: { id: string; label: string; date: string }[];
  notes: string;
  createdAt: string;
};

type Settings = {
  platformName: string;
  platformTagline: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  logoUrl: string | null;
  enableRegistrations: boolean;
  enablePropertyCreation: boolean;
  enableInquiries: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  supportEmail: string;
  noReplyEmail: string;
  updatedAt: string;
};

type ActivityLog = {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  createdAt: string;
};

type StatsSummary = {
  totalUsers: number;
  totalProperties: number;
  totalInquiries: number;
  monthlyInquiries: number;
  activeListings: number;
  pendingApprovals: number;
  revenue: number;
};

const ADMIN_ACTOR_ID = "admin-1";

const users: AdminUser[] = [
  {
    id: ADMIN_ACTOR_ID,
    name: "Ava Martinez",
    email: "ava.martinez@asylenventures.com",
    phone: "+1 (555) 101-1020",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    propertiesCount: 0,
    joinDate: "2022-01-15T10:00:00.000Z",
    lastActive: new Date().toISOString(),
  },
  {
    id: "agent-1",
    name: "James Carter",
    email: "james.carter@asylenventures.com",
    phone: "+1 (555) 223-4455",
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    propertiesCount: 6,
    joinDate: "2022-06-01T10:00:00.000Z",
    lastActive: new Date().toISOString(),
  },
  {
    id: "agent-2",
    name: "Sophia Lee",
    email: "sophia.lee@asylenventures.com",
    phone: "+1 (555) 334-5566",
    role: UserRole.AGENT,
    status: UserStatus.ACTIVE,
    propertiesCount: 4,
    joinDate: "2023-01-12T10:00:00.000Z",
    lastActive: new Date().toISOString(),
  },
  {
    id: "user-1",
    name: "Liam Johnson",
    email: "liam.johnson@example.com",
    phone: "+1 (555) 777-8899",
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    propertiesCount: 0,
    joinDate: "2023-04-18T10:00:00.000Z",
    lastActive: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Olivia Brown",
    email: "olivia.brown@example.com",
    phone: "+1 (555) 111-2222",
    role: UserRole.USER,
    status: UserStatus.INACTIVE,
    propertiesCount: 0,
    joinDate: "2023-09-01T10:00:00.000Z",
    lastActive: new Date().toISOString(),
  },
];

const properties: AdminProperty[] = [
  {
    id: "prop-1",
    title: "Luxury Downtown Penthouse",
    image: "/images/properties/penthouse.jpg",
    agentId: "agent-1",
    agentName: "James Carter",
    price: 1250000,
    category: PropertyCategory.SALE,
    status: PropertyStatus.ACTIVE,
    approvalStatus: ApprovalStatus.APPROVED,
    location: "New York, NY",
    createdAt: "2023-10-01T09:00:00.000Z",
    views: 862,
    isFeatured: true,
    featuredOrder: 1,
  },
  {
    id: "prop-2",
    title: "Modern Family Home",
    image: "/images/properties/family-home.jpg",
    agentId: "agent-2",
    agentName: "Sophia Lee",
    price: 785000,
    category: PropertyCategory.SALE,
    status: PropertyStatus.PENDING,
    approvalStatus: ApprovalStatus.PENDING,
    location: "Austin, TX",
    createdAt: "2023-11-12T11:00:00.000Z",
    views: 340,
    isFeatured: false,
  },
  {
    id: "prop-3",
    title: "Seaside Villa Retreat",
    image: "/images/properties/villa.jpg",
    agentId: "agent-1",
    agentName: "James Carter",
    price: 2100000,
    category: PropertyCategory.SALE,
    status: PropertyStatus.ACTIVE,
    approvalStatus: ApprovalStatus.APPROVED,
    location: "Malibu, CA",
    createdAt: "2023-07-20T14:00:00.000Z",
    views: 1240,
    isFeatured: true,
    featuredOrder: 2,
  },
  {
    id: "prop-4",
    title: "City Center Apartment",
    image: "/images/properties/apartment.jpg",
    agentId: "agent-2",
    agentName: "Sophia Lee",
    price: 3200,
    category: PropertyCategory.RENT,
    status: PropertyStatus.RENTED,
    approvalStatus: ApprovalStatus.APPROVED,
    location: "Seattle, WA",
    createdAt: "2023-05-05T08:00:00.000Z",
    views: 451,
    isFeatured: false,
  },
];

const inquiries: AdminInquiry[] = [
  {
    id: "inq-1",
    visitorName: "Emma Wilson",
    visitorEmail: "emma.wilson@example.com",
    visitorPhone: "+1 (555) 888-9999",
    propertyId: "prop-1",
    propertyTitle: "Luxury Downtown Penthouse",
    status: InquiryStatus.NEW,
    agentId: "agent-1",
    agentName: "James Carter",
    message: "I'm interested in scheduling a viewing this weekend.",
    timeline: [
      { id: uuidv4(), label: "Inquiry created", date: "2023-11-02T10:00:00.000Z" },
    ],
    notes: "High net-worth client, prefers weekend viewing",
    createdAt: "2023-11-02T10:00:00.000Z",
  },
  {
    id: "inq-2",
    visitorName: "Noah Anderson",
    visitorEmail: "noah.anderson@example.com",
    propertyId: "prop-3",
    propertyTitle: "Seaside Villa Retreat",
    status: InquiryStatus.CONTACTED,
    agentId: "agent-1",
    agentName: "James Carter",
    message: "Is the property available for a summer lease?",
    timeline: [
      { id: uuidv4(), label: "Inquiry created", date: "2023-10-15T14:30:00.000Z" },
      { id: uuidv4(), label: "Agent contacted", date: "2023-10-16T09:00:00.000Z" },
    ],
    notes: "Looking for July-August stay.",
    createdAt: "2023-10-15T14:30:00.000Z",
  },
];

let settings: Settings = {
  platformName: "ASYLEN VENTURES",
  platformTagline: "Your Dream Property Awaits",
  companyEmail: "hello@asylenventures.com",
  companyPhone: "+1 (555) 345-6789",
  companyAddress: "500 Central Plaza, Suite 1200, New York, NY",
  logoUrl: null,
  enableRegistrations: true,
  enablePropertyCreation: true,
  enableInquiries: true,
  requireEmailVerification: false,
  requirePhoneVerification: false,
  supportEmail: "support@asylenventures.com",
  noReplyEmail: "noreply@asylenventures.com",
  updatedAt: new Date().toISOString(),
};

const activityLogs: ActivityLog[] = [];

function recordActivity(action: string, entityType: string, entityId?: string, details?: string) {
  activityLogs.unshift({
    id: uuidv4(),
    userId: ADMIN_ACTOR_ID,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date().toISOString(),
  });
}

export function getStats(): StatsSummary {
  const totalUsers = users.length;
  const totalProperties = properties.length;
  const totalInquiries = inquiries.length;
  const monthlyInquiries = inquiries.filter((inq) => {
    const created = new Date(inq.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const activeListings = properties.filter((prop) => prop.status === PropertyStatus.ACTIVE).length;
  const pendingApprovals = properties.filter((prop) => prop.approvalStatus === ApprovalStatus.PENDING).length;

  return {
    totalUsers,
    totalProperties,
    totalInquiries,
    monthlyInquiries,
    activeListings,
    pendingApprovals,
    revenue: 2.4,
  };
}

type UserFilters = {
  role?: string;
  status?: string;
  search?: string;
};

export function getUsers({ role, status, search }: UserFilters = {}): AdminUser[] {
  return users.filter((user) => {
    const matchesRole = role ? user.role === role : true;
    const matchesStatus = status ? user.status === status : true;
    const matchesSearch = search
      ? user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesRole && matchesStatus && matchesSearch;
  });
}

export function getUserById(userId: string) {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const relatedProperties = properties
    .filter((property) => property.agentId === userId)
    .map((property) => ({
      id: property.id,
      title: property.title,
      status: property.status,
      createdAt: property.createdAt,
    }));

  const relatedInquiries = inquiries
    .filter((inquiry) => inquiry.visitorEmail === user.email)
    .map((inquiry) => ({
      id: inquiry.id,
      propertyTitle: inquiry.propertyTitle,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
    }));

  return {
    ...user,
    properties: relatedProperties,
    inquiries: relatedInquiries,
  };
}

export function updateUser(userId: string, data: Partial<Omit<AdminUser, "id" | "joinDate">>) {
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...data,
  };

  recordActivity("Updated user", "USER", userId, JSON.stringify(data));
  return users[index];
}

export function deleteUser(userId: string) {
  if (userId === ADMIN_ACTOR_ID) {
    throw new Error("Administrators cannot delete their own account.");
  }
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) return false;
  users.splice(index, 1);
  recordActivity("Deleted user", "USER", userId);
  return true;
}

export function banUser(userId: string) {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  user.status = UserStatus.BANNED;
  recordActivity("Banned user", "USER", userId);
  return user;
}

export function unbanUser(userId: string) {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;
  user.status = UserStatus.ACTIVE;
  recordActivity("Unbanned user", "USER", userId);
  return user;
}

type PropertyFilters = {
  status?: string;
  category?: string;
  approvalStatus?: string;
  featured?: string;
  search?: string;
};

export function getProperties(filters: PropertyFilters = {}) {
  const { status, category, approvalStatus, featured, search } = filters;
  return properties
    .filter((property) => {
      const matchesStatus = status ? property.status === status : true;
      const matchesCategory = category ? property.category === category : true;
      const matchesApproval = approvalStatus ? property.approvalStatus === approvalStatus : true;
      const matchesFeatured = featured
        ? featured === "true"
          ? property.isFeatured
          : !property.isFeatured
        : true;
      const matchesSearch = search
        ? property.title.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesCategory && matchesApproval && matchesFeatured && matchesSearch;
    })
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export function getPropertyById(propertyId: string) {
  return properties.find((property) => property.id === propertyId) ?? null;
}

export function updateProperty(propertyId: string, data: Partial<AdminProperty>) {
  const index = properties.findIndex((property) => property.id === propertyId);
  if (index === -1) return null;
  properties[index] = { ...properties[index], ...data };
  recordActivity("Updated property", "PROPERTY", propertyId, JSON.stringify(data));
  return properties[index];
}

export function deleteProperty(propertyId: string) {
  const index = properties.findIndex((property) => property.id === propertyId);
  if (index === -1) return false;
  properties.splice(index, 1);
  recordActivity("Deleted property", "PROPERTY", propertyId);
  return true;
}

export function featureProperty(propertyId: string) {
  const property = properties.find((prop) => prop.id === propertyId);
  if (!property) return null;
  property.isFeatured = true;
  const highestOrder = Math.max(0, ...properties.map((prop) => prop.featuredOrder ?? 0));
  property.featuredOrder = highestOrder + 1;
  recordActivity("Featured property", "PROPERTY", propertyId);
  return property;
}

export function unfeatureProperty(propertyId: string) {
  const property = properties.find((prop) => prop.id === propertyId);
  if (!property) return null;
  property.isFeatured = false;
  property.featuredOrder = undefined;
  recordActivity("Unfeatured property", "PROPERTY", propertyId);
  return property;
}

export function reorderFeaturedProperties(propertyIds: string[]) {
  propertyIds.forEach((id, index) => {
    const property = properties.find((prop) => prop.id === id);
    if (property) {
      property.isFeatured = true;
      property.featuredOrder = index + 1;
    }
  });
  recordActivity("Reordered featured properties", "PROPERTY");
  return true;
}

type InquiryFilters = {
  status?: string;
  propertyId?: string;
  agentId?: string;
  search?: string;
};

export function getInquiries(filters: InquiryFilters = {}) {
  const { status, propertyId, agentId, search } = filters;
  return inquiries
    .filter((inquiry) => {
      const matchesStatus = status ? inquiry.status === status : true;
      const matchesProperty = propertyId ? inquiry.propertyId === propertyId : true;
      const matchesAgent = agentId ? inquiry.agentId === agentId : true;
      const matchesSearch = search
        ? inquiry.visitorName.toLowerCase().includes(search.toLowerCase()) ||
          inquiry.visitorEmail.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesStatus && matchesProperty && matchesAgent && matchesSearch;
    })
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export function getInquiryById(inquiryId: string) {
  return inquiries.find((inquiry) => inquiry.id === inquiryId) ?? null;
}

export function updateInquiry(inquiryId: string, data: Partial<AdminInquiry>) {
  const index = inquiries.findIndex((inquiry) => inquiry.id === inquiryId);
  if (index === -1) return null;
  inquiries[index] = { ...inquiries[index], ...data };
  recordActivity("Updated inquiry", "INQUIRY", inquiryId, JSON.stringify(data));
  return inquiries[index];
}

export function deleteInquiry(inquiryId: string) {
  const index = inquiries.findIndex((inquiry) => inquiry.id === inquiryId);
  if (index === -1) return false;
  inquiries.splice(index, 1);
  recordActivity("Deleted inquiry", "INQUIRY", inquiryId);
  return true;
}

export function getSettings() {
  return settings;
}

export function updateSettings(data: Partial<Settings>) {
  settings = { ...settings, ...data, updatedAt: new Date().toISOString() };
  recordActivity("Updated system settings", "SETTINGS", undefined, JSON.stringify(data));
  return settings;
}

export function getActivityLogs(limit = 50) {
  return activityLogs.slice(0, limit);
}

export function getFeaturedProperties() {
  return properties
    .filter((property) => property.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export function getAnalyticsOverview() {
  return {
    totalMetrics: {
      users: users.length,
      properties: properties.length,
      inquiries: inquiries.length,
      revenue: 2.75,
    },
    monthlyMetrics: {
      users: Math.round(users.length * 0.08),
      properties: Math.round(properties.length * 0.1),
      inquiries: Math.round(inquiries.length * 0.4) + 40,
      revenue: 0.32,
      conversions: 68,
    },
    growth: {
      users: 12.5,
      properties: 8.2,
      inquiries: 15.7,
    },
    userGrowth: [
      { month: "Jan", users: 180 },
      { month: "Feb", users: 230 },
      { month: "Mar", users: 270 },
      { month: "Apr", users: 320 },
      { month: "May", users: 360 },
      { month: "Jun", users: 420 },
    ],
    newProperties: [
      { week: "Week 1", properties: 25 },
      { week: "Week 2", properties: 32 },
      { week: "Week 3", properties: 28 },
      { week: "Week 4", properties: 35 },
    ],
    inquiriesTrend: [
      { week: "Week 1", inquiries: 80 },
      { week: "Week 2", inquiries: 95 },
      { week: "Week 3", inquiries: 110 },
      { week: "Week 4", inquiries: 135 },
    ],
    conversionRate: [
      { month: "Jan", rate: 2.1 },
      { month: "Feb", rate: 2.4 },
      { month: "Mar", rate: 2.7 },
      { month: "Apr", rate: 3.1 },
      { month: "May", rate: 3.4 },
      { month: "Jun", rate: 3.8 },
    ],
    propertiesByCategory: [
      { category: "Sale", value: properties.filter((p) => p.category === PropertyCategory.SALE).length },
      { category: "Rent", value: properties.filter((p) => p.category === PropertyCategory.RENT).length },
      { category: "Lease", value: properties.filter((p) => p.category === PropertyCategory.LEASE).length },
    ],
    propertiesByStatus: [
      { status: "Active", value: properties.filter((p) => p.status === PropertyStatus.ACTIVE).length },
      { status: "Pending", value: properties.filter((p) => p.status === PropertyStatus.PENDING).length },
      { status: "Sold", value: properties.filter((p) => p.status === PropertyStatus.SOLD).length },
      { status: "Rented", value: properties.filter((p) => p.status === PropertyStatus.RENTED).length },
    ],
    agentPerformance: users
      .filter((user) => user.role === UserRole.AGENT)
      .map((agent) => ({
        agent: agent.name,
        deals: agent.propertiesCount,
        revenue: Number((Math.random() * 1.2 + 0.5).toFixed(2)),
      })),
  };
}
