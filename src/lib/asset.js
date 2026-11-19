/**
 * URL for a file in public/, prefixed with Vite's `base` (vite.config.js).
 * Use this for every public asset referenced from JS — a plain '/file.png'
 * would point at the domain root and 404 when the site lives under /SriramPortfolio/.
 *
 *   asset('profile.png') → '/SriramPortfolio/profile.png'
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
