# Google Maps Integration - Phase 12 Documentation

## Overview

This document provides comprehensive information about the Google Maps integration implemented in Phase 12 of the ASYLEN VENTURES Real Estate Platform.

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [Components](#components)
3. [API Endpoints](#api-endpoints)
4. [Utilities](#utilities)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)

## Setup & Configuration

### Google Maps API Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   
2. **Enable Required APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API

3. **Create API Key**:
   - Navigate to "Credentials" in the Google Cloud Console
   - Click "Create Credentials" > "API Key"
   - Restrict the API key to your application URLs

4. **Configure Billing**:
   - Set up billing for your Google Cloud project
   - Monitor API usage to manage costs

### Environment Variables

Add these variables to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Used in client-side components
- `GOOGLE_MAPS_API_KEY`: Used in server-side API routes

### Database Schema

The `Property` model has been updated to include location coordinates:

```prisma
model Property {
  // ... other fields
  latitude     Float?
  longitude    Float?
  // ... other fields
  
  @@index([latitude, longitude])
}
```

Run migrations:

```bash
npm run db:generate
npm run db:push
```

## Components

### 1. GoogleMapsProvider

**File**: `components/maps/GoogleMapsProvider.tsx`

Wrapper component that loads the Google Maps JavaScript API.

**Props**:
- `children`: ReactNode - Child components
- `libraries?`: Libraries - Google Maps libraries to load (default: ["places", "geometry"])
- `loadingFallback?`: ReactNode - Custom loading component
- `errorFallback?`: ReactNode - Custom error component

**Example**:
```tsx
<GoogleMapsProvider>
  <YourMapComponent />
</GoogleMapsProvider>
```

### 2. PropertyMap

**File**: `components/maps/PropertyMap.tsx`

Displays a map with a single property location on the detail page.

**Props**:
- `title`: string - Property title
- `price`: number - Property price
- `address`: string - Property address
- `latitude`: number - Property latitude
- `longitude`: number - Property longitude
- `image?`: string - Property image URL

**Features**:
- Interactive marker with info window
- "Get Directions" button
- Clickable address link
- Zoom controls

### 3. PropertyListingMap

**File**: `components/maps/PropertyListingMap.tsx`

Shows multiple properties on a map view with clustering.

**Props**:
- `properties`: MapProperty[] - Array of properties to display
- `selectedPropertyId?`: string | null - Currently selected property ID
- `onPropertyClick?`: (property: MapProperty) => void - Callback when a marker is clicked
- `containerStyle?`: CSSProperties - Custom map container styles

**Features**:
- Marker clustering for performance
- Auto-fit bounds to show all properties
- Property counter display
- Custom markers with price labels

### 4. LocationPicker

**File**: `components/maps/LocationPicker.tsx`

Interactive map for selecting a location in property forms.

**Props**:
- `onLocationSelect`: (location: PlaceDetails) => void - Callback when location is selected
- `defaultAddress?`: string - Pre-filled address
- `defaultLatitude?`: number - Pre-filled latitude
- `defaultLongitude?`: number - Pre-filled longitude

**Features**:
- Address autocomplete
- Click on map to select location
- Draggable marker
- Manual coordinate input
- Reverse geocoding

### 5. AddressAutocomplete

**File**: `components/maps/AddressAutocomplete.tsx`

Autocomplete input field for address search using Google Places API.

**Props**:
- `onSelect`: (place: PlaceDetails) => void - Callback when an address is selected
- `defaultValue?`: string - Default input value
- `placeholder?`: string - Input placeholder text
- `className?`: string - Additional CSS classes

**Features**:
- Debounced search (300ms)
- Filtered to Noida area (India)
- Dropdown with suggestions
- Keyboard navigation support
- No results message

### 6. MapMarker

**File**: `components/maps/MapMarker.tsx`

Custom marker component with property information.

**Props**:
- `property`: MapProperty - Property data
- `isActive?`: boolean - Whether the marker is currently selected
- `onClick?`: () => void - Click handler
- `clusterer?`: MarkerClusterer - Marker clusterer instance

**Features**:
- Custom SVG markers
- Color-coded by category
- Price label on marker
- Hover effects

### 7. MapCluster

**File**: `components/maps/MapCluster.tsx`

Manages marker clustering for multiple properties.

**Props**:
- `properties`: MapProperty[] - Properties to display
- `onMarkerClick?`: (property: MapProperty) => void - Marker click handler
- `activePropertyId?`: string | null - Currently active property ID

### 8. MapPopup

**File**: `components/maps/MapPopup.tsx`

Info window displayed when clicking a marker.

**Props**:
- `property`: MapProperty - Property to display
- `onClose`: () => void - Close handler

**Features**:
- Property image
- Title and price
- Category badge
- "View Details" link

## API Endpoints

### 1. Autocomplete

**Endpoint**: `GET /api/locations/autocomplete`

**Query Parameters**:
- `address`: string - Address search query (min 3 characters)

**Response**:
```json
{
  "suggestions": [
    {
      "address": "Sector 128, Noida, Uttar Pradesh",
      "coordinates": {
        "latitude": 28.5266,
        "longitude": 77.3926
      },
      "placeId": "ChIJ..."
    }
  ]
}
```

### 2. Geocode

**Endpoint**: `POST /api/locations/geocode`

**Body**:
```json
{
  "address": "Sector 128, Noida, Uttar Pradesh"
}
```

**Response**:
```json
{
  "coordinates": {
    "latitude": 28.5266,
    "longitude": 77.3926
  },
  "formattedAddress": "Sector 128, Noida, Uttar Pradesh 201304, India"
}
```

### 3. Reverse Geocode

**Endpoint**: `GET /api/locations/reverse-geocode`

**Query Parameters**:
- `lat`: number - Latitude
- `lng`: number - Longitude

**Response**:
```json
{
  "address": "Sector 128, Noida, Uttar Pradesh 201304, India",
  "placeId": "ChIJ..."
}
```

### 4. Nearby Properties

**Endpoint**: `GET /api/locations/nearby`

**Query Parameters**:
- `latitude`: number - Center latitude
- `longitude`: number - Center longitude
- `radius`: number - Search radius in kilometers (default: 5)

**Response**:
```json
{
  "properties": [
    {
      "id": "123",
      "title": "Property Name",
      "price": 5000000,
      "address": "Address",
      "city": "Noida",
      "coordinates": {
        "latitude": 28.5266,
        "longitude": 77.3926
      },
      "image": "image-url",
      "category": "HOUSE",
      "distance": 2.5
    }
  ]
}
```

## Utilities

**File**: `lib/maps-utils.ts`

### Functions

#### calculateDistance(lat1, lng1, lat2, lng2)

Calculates distance between two coordinates using the Haversine formula.

**Returns**: Distance in kilometers

#### formatCoordinates(lat, lng)

Formats coordinates for display (e.g., "28.5266°N, 77.3926°E").

#### getBounds(properties)

Calculates map bounds to fit all properties.

**Returns**: MapBounds object or null

#### geocodeAddress(address)

Client-side geocoding using the API endpoint.

**Returns**: Promise<LocationCoordinates | null>

#### reverseGeocode(lat, lng)

Client-side reverse geocoding using the API endpoint.

**Returns**: Promise<string | null>

#### getMarkerColor(category)

Returns color code for a property category.

**Categories**:
- HOUSE: Green (#22c55e)
- APARTMENT: Blue (#3b82f6)
- LAND: Orange (#f97316)
- CONDO: Gold (#D4AF37)
- TOWNHOUSE: Purple (#a855f7)
- COMMERCIAL: Light Blue (#0ea5e9)
- LUXURY: Gold (#D4AF37)
- RENTAL: Purple (#7c3aed)

#### formatDistance(distance)

Formats distance for display (e.g., "2.5km" or "850m").

#### isValidCoordinates(lat, lng)

Validates latitude and longitude values.

## Usage Examples

### Property Detail Page with Map

```tsx
import { PropertyMap } from '@/components/maps';

export default function PropertyDetailPage() {
  const property = {
    title: "Prime Residence",
    price: 87500000,
    address: "Sector 128, Noida",
    latitude: 28.5266,
    longitude: 77.3926,
    image: "/property.jpg"
  };

  return (
    <div>
      <PropertyMap {...property} />
    </div>
  );
}
```

### Property Listing with Map View

```tsx
"use client";

import { useState } from 'react';
import { PropertyListingMap } from '@/components/maps';

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState([]);

  return (
    <div>
      <button onClick={() => setViewMode('map')}>Map View</button>
      {viewMode === 'map' && (
        <PropertyListingMap properties={properties} />
      )}
    </div>
  );
}
```

### Location Picker in Form

```tsx
"use client";

import { useState } from 'react';
import { LocationPicker } from '@/components/maps';

export default function AddPropertyForm() {
  const [location, setLocation] = useState(null);

  return (
    <form>
      <LocationPicker
        onLocationSelect={(place) => {
          setLocation(place);
          console.log('Selected:', place);
        }}
      />
    </form>
  );
}
```

### Fetch Nearby Properties

```tsx
async function fetchNearbyProperties(lat: number, lng: number) {
  const response = await fetch(
    `/api/locations/nearby?latitude=${lat}&longitude=${lng}&radius=5`
  );
  const data = await response.json();
  return data.properties;
}
```

## Testing

### Manual Testing Checklist

#### Property Detail Page Map
- [ ] Map renders correctly
- [ ] Marker appears at property location
- [ ] Info window opens on marker click
- [ ] "Get Directions" button works
- [ ] Address link is clickable
- [ ] Zoom controls functional

#### Property Listing Map
- [ ] All properties display on map
- [ ] Markers cluster at low zoom levels
- [ ] Clicking marker opens info window
- [ ] Map bounds fit all properties
- [ ] View toggle works (Grid/List/Map)
- [ ] Property counter displays correctly

#### Location Picker
- [ ] Address autocomplete works
- [ ] Suggestions appear after typing
- [ ] Clicking suggestion updates map
- [ ] Map click sets location
- [ ] Marker is draggable
- [ ] Manual coordinate input works
- [ ] Reverse geocoding works

#### Address Autocomplete
- [ ] Input debouncing works (300ms)
- [ ] Dropdown appears with results
- [ ] No results message displays
- [ ] Keyboard navigation works
- [ ] Selection updates parent component

#### API Endpoints
- [ ] Autocomplete returns valid results
- [ ] Geocoding works for valid addresses
- [ ] Reverse geocoding returns addresses
- [ ] Nearby properties calculated correctly
- [ ] Error handling works properly

#### Mobile Responsiveness
- [ ] Maps render on mobile devices
- [ ] Touch interactions work
- [ ] Map controls accessible
- [ ] Responsive layouts adjust properly

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Testing

- [ ] Maps load within 2 seconds
- [ ] Marker clustering improves performance with 100+ properties
- [ ] Autocomplete debouncing prevents excessive API calls
- [ ] No memory leaks on component unmount

## Security Considerations

1. **API Key Restrictions**:
   - Restrict API key to your domain(s)
   - Enable only required APIs
   - Set up usage quotas

2. **Server-Side Validation**:
   - Validate coordinates on the server
   - Sanitize address inputs
   - Rate limit API requests

3. **HTTPS**:
   - Always use HTTPS for Google Maps API
   - Secure all API endpoints

## Troubleshooting

### Maps Not Loading

1. Check API key is correct in `.env.local`
2. Verify APIs are enabled in Google Cloud Console
3. Check browser console for errors
4. Ensure billing is configured

### Markers Not Appearing

1. Verify coordinates are valid
2. Check zoom level and map bounds
3. Inspect marker icon rendering
4. Review browser console

### Autocomplete Not Working

1. Check Places API is enabled
2. Verify API key has Places API access
3. Check network requests in DevTools
4. Review console for errors

## Cost Management

### API Usage Optimization

1. **Implement caching**:
   - Cache geocoding results
   - Store commonly searched locations

2. **Debounce requests**:
   - Address autocomplete already debounced
   - Consider debouncing map interactions

3. **Monitor usage**:
   - Set up alerts in Google Cloud Console
   - Review monthly usage reports
   - Set quotas to prevent overages

### Estimated Costs (as of 2024)

- Maps JavaScript API: $7 per 1,000 loads
- Geocoding API: $5 per 1,000 requests
- Places API (Autocomplete): $2.83 per 1,000 requests

## Future Enhancements

1. **Advanced Features**:
   - Street View integration
   - Drawing tools for property boundaries
   - Satellite/Terrain view toggle
   - Route planning
   - Traffic layer

2. **Performance**:
   - Server-side rendering for static maps
   - Image caching
   - Progressive loading

3. **UX Improvements**:
   - Save favorite locations
   - Location history
   - Custom map styles
   - Dark mode support

## Support & Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [@react-google-maps/api Documentation](https://react-google-maps-api-docs.netlify.app/)

## Changelog

### Phase 12 - Initial Implementation
- ✅ Google Maps setup and configuration
- ✅ Property detail page map
- ✅ Property listing map view
- ✅ Location picker component
- ✅ Address autocomplete
- ✅ API endpoints (geocode, autocomplete, nearby)
- ✅ Custom markers and clustering
- ✅ Distance calculation utilities
- ✅ Nearby properties feature
- ✅ Database schema updates
