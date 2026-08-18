import { eventConfig } from "./event-config";

export const isLandingMode = eventConfig.launch?.landingMode ?? false;

const fullMainNavItems = [
  { href: "/schedule", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
] as const;

const landingMainNavItems = [
  { href: "/venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
] as const;

const fullResourcesNavItems = [
  { href: "/register", label: "Register Now" },
  { href: "/hotel-information", label: "Hotel Information" },
] as const;

const landingResourcesNavItems = [
  { href: "/hotel-information", label: "Hotel Information" },
] as const;

const fullFooterLinks = [
  { href: "/schedule", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/register", label: "Register" },
  { href: "/venue", label: "Venue" },
  { href: "/contact", label: "Contact" },
] as const;

const landingFooterLinks = [
  { href: "/venue", label: "Venue" },
  { href: "/hotel-information", label: "Hotels" },
  { href: "/contact", label: "Contact" },
] as const;

export const mainNavItems = isLandingMode ? landingMainNavItems : fullMainNavItems;
export const resourcesNavItems = isLandingMode ? landingResourcesNavItems : fullResourcesNavItems;
export const footerLinks = isLandingMode ? landingFooterLinks : fullFooterLinks;

export const publishedSitemapPaths = isLandingMode
  ? ["/", "/venue", "/hotel-information", "/contact"]
  : [
      "/",
      "/schedule",
      "/speakers",
      "/sponsors",
      "/venue",
      "/register",
      "/hotel-information",
      "/contact",
    ];
