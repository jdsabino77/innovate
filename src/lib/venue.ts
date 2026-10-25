import venueData from "../data/venue.json";

export type VenuePhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
};

export type VenueRate = {
  label: string;
  value: string;
};

export type VenueGettingThere = {
  eyebrow: string;
  title: string;
  intro: string;
  address: string;
  directionsUrl: string;
  directionsLabel: string;
  arrival: { title: string; steps: string[] };
  parking: {
    title: string;
    lot: string;
    paidNote: string;
    rates: VenueRate[];
    notes: string[];
  };
  walking: {
    title: string;
    duration: string;
    steps: string[];
    directionsUrl: string;
    directionsLabel: string;
  };
};

export type VenueData = {
  name: string;
  description: string;
  gettingThere: VenueGettingThere;
  onSite: string[];
  featured: string[];
  aboutFeatured: string;
  photos: VenuePhoto[];
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
