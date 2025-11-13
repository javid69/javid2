import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyType, PropertyStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const propertyType = searchParams.get("propertyType");
    const city = searchParams.get("city");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    const status = searchParams.get("status");
    const amenities = searchParams.get("amenities")?.split(",").filter(Boolean);
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (propertyType) {
      const types = propertyType.split(",");
      if (types.length === 1) {
        where.propertyType = types[0] as PropertyType;
      } else {
        where.propertyType = { in: types };
      }
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (bedrooms) {
      where.bedrooms = { gte: parseInt(bedrooms) };
    }

    if (bathrooms) {
      where.bathrooms = { gte: parseInt(bathrooms) };
    }

    if (minArea || maxArea) {
      where.squareFeet = {};
      if (minArea) where.squareFeet.gte = parseInt(minArea);
      if (maxArea) where.squareFeet.lte = parseInt(maxArea);
    }

    if (status) {
      where.status = status as PropertyStatus;
    } else {
      where.status = PropertyStatus.AVAILABLE;
    }

    if (amenities && amenities.length > 0) {
      where.amenities = {
        hasEvery: amenities,
      };
    }

    let orderBy: any = { createdAt: "desc" };

    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      case "featured":
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}
