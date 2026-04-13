/** Official project / repository name (hyphenated). */
export const APP_NAME_SLUG = "Secure-File-Sharing-Platform";

/** Product name shown in the UI (natural spacing). */
export const APP_NAME = "Secure File Sharing Platform";

/** Shorter label for tight spaces (e.g. small nav). */
export const APP_NAME_SHORT = "Secure file sharing";

/** One-line pitch for metadata and compact UI. */
export const APP_TAGLINE =
  "Password-protected file sharing with expiry — for teams and everyday users.";

/**
 * Plain-language expectations for people who are not in IT (README, marketing).
 * Kept honest: no claim of browser-only “true” E2E; matches technical security note in repo README.
 */
export const APP_DESCRIPTION_NON_TECH = [
  "You use it like email with an attachment, but the file lives on a secure link instead of clogging inboxes.",
  "You choose a password and an expiry date. Anyone you send the link to needs that password to download — you can text or call them the password separately.",
  "Recipients do not need an account if you use a public link; they only need the link, the password, and a normal web browser.",
  "You only send JPG, PNG, or PDF files up to 4 MB. You do not need VPNs, command lines, or IT to set this up: register, upload, and share.",
] as const;
