import type {
  CargoRequestStatus,
  CargoResponseStatus,
} from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

export type PublicCargoRequestCard = {
  id: string;
  created_at: Date;
  item_name: string;
  from_location: string;
  to_location: string;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
  status: CargoRequestStatus;
};

export type CargoResponseItem = {
  id: string;
  created_at: Date;
  price: string | null;
  currency: string | null;
  estimated_time: string | null;
  comment: string;
  contact_name: string | null;
  contact_phone: string | null;
  status: CargoResponseStatus;
  sellerProfile: {
    id: string;
    company_name: string;
    slug: string;
  };
};

export type SellerCargoRequestItem = {
  id: string;
  created_at: Date;
  name: string;
  phone: string;
  company: string | null;
  from_location: string;
  to_location: string;
  item_name: string;
  description: string | null;
  item_photo_url: string | null;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
  urgency: string | null;
  comment: string | null;
  service_type: string | null;
  direction: string | null;
  status: CargoRequestStatus;
  responseCount: number;
  ownResponse: CargoResponseItem | null;
};

export type AdminCargoRequestItem = SellerCargoRequestItem & {
  responses: CargoResponseItem[];
};

export type BuyerCargoRequestItem = {
  id: string;
  created_at: Date;
  from_location: string;
  to_location: string;
  item_name: string;
  item_photo_url: string | null;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
  urgency: string | null;
  comment: string | null;
  status: CargoRequestStatus;
  responses: CargoResponseItem[];
};

const publicSelect = {
  id: true,
  created_at: true,
  item_name: true,
  from_location: true,
  to_location: true,
  quantity: true,
  weight: true,
  dimensions: true,
  status: true,
} as const;

const responseSelect = {
  id: true,
  created_at: true,
  price: true,
  currency: true,
  estimated_time: true,
  comment: true,
  contact_name: true,
  contact_phone: true,
  status: true,
  sellerProfile: {
    select: {
      id: true,
      company_name: true,
      slug: true,
    },
  },
} as const;

const sellerRequestSelect = {
  id: true,
  created_at: true,
  name: true,
  phone: true,
  company: true,
  from_location: true,
  to_location: true,
  item_name: true,
  description: true,
  item_photo_url: true,
  quantity: true,
  weight: true,
  dimensions: true,
  urgency: true,
  comment: true,
  service_type: true,
  direction: true,
  status: true,
  _count: {
    select: { responses: true },
  },
} as const;

export async function getPublicRecentCargoRequests(
  limit = 6,
): Promise<PublicCargoRequestCard[]> {
  return prisma.cargoRequest.findMany({
    orderBy: { created_at: "desc" },
    take: limit,
    select: publicSelect,
  });
}

export async function getSellerCargoRequests(options?: {
  statusFilter?: CargoRequestStatus | null;
  sellerProfileId?: string | null;
  limit?: number;
  /** When false, private name/phone are blanked before leaving the server. */
  includeContacts?: boolean;
}): Promise<SellerCargoRequestItem[]> {
  const sellerProfileId = options?.sellerProfileId ?? null;
  const includeContacts = options?.includeContacts === true;

  const rows = await prisma.cargoRequest.findMany({
    where: options?.statusFilter ? { status: options.statusFilter } : undefined,
    orderBy: { created_at: "desc" },
    take: options?.limit ?? 100,
    select: {
      ...sellerRequestSelect,
      responses: {
        where: sellerProfileId
          ? { seller_profile_id: sellerProfileId }
          : { id: "00000000-0000-0000-0000-000000000000" },
        take: 1,
        select: responseSelect,
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    name: includeContacts ? row.name : "",
    phone: includeContacts ? row.phone : "",
    company: row.company,
    from_location: row.from_location,
    to_location: row.to_location,
    item_name: row.item_name,
    description: row.description,
    item_photo_url: row.item_photo_url,
    quantity: row.quantity,
    weight: row.weight,
    dimensions: row.dimensions,
    urgency: row.urgency,
    comment: row.comment,
    service_type: row.service_type,
    direction: row.direction,
    status: row.status,
    responseCount: row._count.responses,
    ownResponse: row.responses[0] ?? null,
  }));
}

export async function getAdminCargoRequests(options?: {
  statusFilter?: CargoRequestStatus | null;
  limit?: number;
}): Promise<AdminCargoRequestItem[]> {
  const rows = await prisma.cargoRequest.findMany({
    where: options?.statusFilter ? { status: options.statusFilter } : undefined,
    orderBy: { created_at: "desc" },
    take: options?.limit ?? 100,
    select: {
      ...sellerRequestSelect,
      responses: {
        orderBy: { created_at: "desc" },
        select: responseSelect,
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    created_at: row.created_at,
    name: row.name,
    phone: row.phone,
    company: row.company,
    from_location: row.from_location,
    to_location: row.to_location,
    item_name: row.item_name,
    description: row.description,
    item_photo_url: row.item_photo_url,
    quantity: row.quantity,
    weight: row.weight,
    dimensions: row.dimensions,
    urgency: row.urgency,
    comment: row.comment,
    service_type: row.service_type,
    direction: row.direction,
    status: row.status,
    responseCount: row._count.responses,
    ownResponse: null,
    responses: row.responses,
  }));
}

export async function getBuyerCargoRequests(
  userId: string,
): Promise<BuyerCargoRequestItem[]> {
  return prisma.cargoRequest.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    take: 50,
    select: {
      id: true,
      created_at: true,
      from_location: true,
      to_location: true,
      item_name: true,
      item_photo_url: true,
      quantity: true,
      weight: true,
      dimensions: true,
      urgency: true,
      comment: true,
      status: true,
      responses: {
        orderBy: { created_at: "desc" },
        select: responseSelect,
      },
    },
  });
}

export type CargoRequestDetailViewerRole = "guest" | "owner" | "company" | "admin";

export type CargoRequestDetailData = {
  id: string;
  created_at: Date;
  item_name: string;
  description: string | null;
  item_photo_url: string | null;
  from_location: string;
  to_location: string;
  quantity: string | null;
  weight: string | null;
  dimensions: string | null;
  urgency: string | null;
  comment: string | null;
  service_type: string | null;
  direction: string | null;
  status: CargoRequestStatus;
  responseCount: number;
  /** Client contacts — only for owner/admin. */
  clientName: string | null;
  clientPhone: string | null;
  clientCompany: string | null;
  viewerRole: CargoRequestDetailViewerRole;
  isOwner: boolean;
  isClosed: boolean;
  canRespond: boolean;
  ownResponse: CargoResponseItem | null;
  /** Full response list for owner/admin; company sees own only via ownResponse. */
  responses: CargoResponseItem[];
};

export async function getCargoRequestDetailForViewer(options: {
  requestId: string;
  userId: string | null;
  userRole: string | null;
  sellerProfileId: string | null;
}): Promise<CargoRequestDetailData | null> {
  const row = await prisma.cargoRequest.findUnique({
    where: { id: options.requestId },
    select: {
      ...sellerRequestSelect,
      user_id: true,
      responses: {
        orderBy: { created_at: "desc" },
        select: responseSelect,
      },
    },
  });

  if (!row) {
    return null;
  }

  const isAdmin = options.userRole === "ADMIN";
  const isOwner = Boolean(options.userId && row.user_id === options.userId);
  const ownResponse =
    options.sellerProfileId
      ? (row.responses.find((item) => item.sellerProfile.id === options.sellerProfileId) ??
        null)
      : null;
  const hasCompanyProfile = Boolean(options.sellerProfileId);
  const isClosed = row.status === "CLOSED";
  const canRespond =
    Boolean(options.userId) &&
    hasCompanyProfile &&
    !isOwner &&
    !isClosed &&
    !ownResponse &&
    (options.userRole === "SELLER" ||
      options.userRole === "ADMIN" ||
      options.userRole === "BUYER");

  let viewerRole: CargoRequestDetailViewerRole = "guest";
  if (isAdmin) {
    viewerRole = "admin";
  } else if (isOwner) {
    viewerRole = "owner";
  } else if (options.userId) {
    viewerRole = "company";
  }

  const showClientContacts = isOwner || isAdmin;
  const showAllResponses = isOwner || isAdmin;

  return {
    id: row.id,
    created_at: row.created_at,
    item_name: row.item_name,
    description: row.description,
    item_photo_url: row.item_photo_url,
    from_location: row.from_location,
    to_location: row.to_location,
    quantity: row.quantity,
    weight: row.weight,
    dimensions: row.dimensions,
    urgency: row.urgency,
    comment: row.comment,
    service_type: row.service_type,
    direction: row.direction,
    status: row.status,
    responseCount: row._count.responses,
    clientName: showClientContacts ? row.name : null,
    clientPhone: showClientContacts ? row.phone : null,
    clientCompany: showClientContacts ? row.company : null,
    viewerRole,
    isOwner,
    isClosed,
    canRespond,
    ownResponse,
    responses: showAllResponses
      ? row.responses
      : ownResponse
        ? [ownResponse]
        : [],
  };
}
