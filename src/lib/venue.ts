import venueData from "../data/venue.json";

export type VenuePhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
};

export type VenueData = {
  name: string;
  description: string;
  directionsNote: string;
  onSite: string[];
  featured: string[];
  aboutFeatured: string;
  sourceAlbums: { label: string; url: string }[];
  photos: VenuePhoto[];
  categories: { id: string; label: string }[];
};

export const venue = venueData as VenueData;

export function getVenuePhoto(id: string): VenuePhoto | undefined {
  return venue.photos.find((photo) => photo.id === id);
}

export function getFeaturedPhotos(): VenuePhoto[] {
  return venue.featured
    .map((id) => getVenuePhoto(id))
    .filter((photo): photo is VenuePhoto => Boolean(photo));
}
