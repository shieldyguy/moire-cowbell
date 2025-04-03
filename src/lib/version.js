// Version information for the application
export const VERSION = {
  hash: import.meta.env.VITE_GIT_HASH || 'dev',
  buildDate: new Date().toISOString()
};

// Format the version string
export function getVersionString() {
  return `${VERSION.hash.substring(0, 7)}`;
} 