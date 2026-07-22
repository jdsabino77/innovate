import config from "../../event-config.json";

export type EventConfig = {
  eventName: string;
  eventNameLong: string;
  eventDate: string;
  eventDateDisplay: string;
  venue: string;
  host: string;
  hostUrl: string;
  typeformUrl: string;
  contactEmail: string;
  siteUrl: string;
};

export const eventConfig = config as EventConfig;

export const siteDescription = `${eventConfig.eventNameLong} — advancing medical aesthetics through innovation, science, and personalized patient care. ${eventConfig.eventDateDisplay} in Toronto at ${eventConfig.venue}.`;
