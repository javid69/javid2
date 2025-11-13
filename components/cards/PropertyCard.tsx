import Link from "next/link";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  status: string;
  imageUrl?: string;
}

export function PropertyCard({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  squareFeet,
  status,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div
        className="h-48 bg-gradient-to-br from-primary/20 to-accent/20"
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" }
            : undefined
        }
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{address}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {bedrooms} bed • {bathrooms} bath
          </span>
          <span className="text-sm text-muted-foreground">
            {squareFeet.toLocaleString()} sq ft
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${price.toLocaleString()}
          </span>
          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
            {status}
          </span>
        </div>
      </div>
    </Link>
  );
}
