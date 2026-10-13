// =============================================================================
// CIDOL WORLD INCORPORATION — scripts/clientService.js
// An ES module (import/export) that asynchronously loads the Client
// Directory's data from a local JSON file, with try/catch error handling.
// Imported by scripts/directory.js.
// =============================================================================

/**
 * Fetches and parses data/clients.json.
 * Demonstrates: async/await, a try/catch block, and fetching local JSON data.
 * Returns an empty array (rather than throwing) on failure, so the page can
 * degrade gracefully instead of breaking.
 *
 * Note: fetch() of a local file requires the page to be served over
 * http/https (e.g. a local dev server or GitHub Pages) — opening index.html
 * directly from disk (a file:// URL) will block this request in most
 * browsers under their same-origin/CORS rules.
 */
export async function fetchClients() {
  try {
    const response = await fetch("data/clients.json");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not load client directory data: ${error.message}`);
    return [];
  }
}
