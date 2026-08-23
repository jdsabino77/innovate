import config from "../../event-config.json";

export type TicketingConfig = {
  provider: "ticket-tailor" | "eventbrite";
  enabled: boolean;
  embedUrl: string;
  checkoutUrl: string;
};

export type LaunchConfig = {
  landingMode: boolean;
};

export type EventConfig = {
  eventName: string;
  eventNameLong: string;
  eventDate: string;
  eventDateDisplay: string;
  venue: string;
  venueAddress?: string;
  venueDisplay?: string;
  host: string;
  hostUrl: string;
  typeformUrl: string;
  contactEmail: string;
  newsletterNotifyEmail?: string;
  siteUrl: string;
  ticketing: TicketingConfig;
  launch?: LaunchConfig;
};

export const eventConfig = config as EventConfig;

export const venueDisplay =
  eventConfig.venueDisplay ??
  (eventConfig.venueAddress ? `${eventConfig.venue} — ${eventConfig.venueAddress}` : eventConfig.venue);

export const siteDescription = `${eventConfig.eventNameLong} — advancing medical aesthetics through innovation, science, and personalized patient care. ${eventConfig.eventDateDisplay} in Toronto at ${venueDisplay}.`;

export function isTicketingOpen(ticketing: TicketingConfig = eventConfig.ticketing): boolean {
  if (!ticketing.enabled) return false;
  return Boolean(ticketing.embedUrl || ticketing.checkoutUrl);
}
