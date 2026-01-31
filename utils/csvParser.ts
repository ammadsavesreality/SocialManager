import { BaseProfile } from '../types';

export const parseData = async (file: File): Promise<BaseProfile[]> => {
  const text = await file.text();
  
  // 1. Try Parsing as JSON (Instagram Export Format)
  try {
    const json = JSON.parse(text);
    let rawList: any[] = [];

    // Instagram JSON structures vary by export date
    if (Array.isArray(json)) {
      rawList = json;
    } else if (typeof json === 'object') {
      // Look for known keys in Instagram export
      if (json.relationships_following) rawList = json.relationships_following;
      else if (json.relationships_followers) rawList = json.relationships_followers;
      else if (json.users) rawList = json.users; // Generic
      else {
        // Fallback: look for the first array property
        const val = Object.values(json).find(v => Array.isArray(v));
        if (val) rawList = val as any[];
      }
    }

    if (rawList.length > 0) {
      return rawList.map((item: any) => {
        // Format A: Official Instagram Export
        // { "string_list_data": [{ "href": "...", "value": "username", ... }] }
        if (item.string_list_data && Array.isArray(item.string_list_data) && item.string_list_data[0]) {
          const data = item.string_list_data[0];
          return {
            username: data.value,
            profileUrl: data.href
          };
        }
        
        // Format B: Simple JSON object
        if (item.username) {
          return {
            username: item.username,
            profileUrl: item.profileUrl || `https://www.instagram.com/${item.username}/`
          };
        }
        
        // Format C: Just a string
        if (typeof item === 'string') {
           return {
             username: item,
             profileUrl: `https://www.instagram.com/${item}/`
           };
        }

        return null;
      }).filter((p): p is BaseProfile => p !== null);
    }
  } catch (e) {
    // Not valid JSON, proceed to CSV
  }

  // 2. Parse as CSV
  const lines = text.split(/\r?\n/);
  const profiles: BaseProfile[] = [];

  const cleanCell = (str: string) => str ? str.replace(/^"|"$/g, '').trim() : '';

  lines.forEach((line) => {
    if (!line.trim()) return;

    const columns = line.split(',');
    const username = cleanCell(columns[0]);
    
    if (!username) return;
    
    // Skip headers
    const lower = username.toLowerCase();
    if (lower === 'username' || lower === 'profile' || lower === 'name') return;

    // Detect URL or construct it
    let profileUrl = '';
    if (columns.length > 1 && columns[1].includes('instagram.com')) {
        profileUrl = cleanCell(columns[1]);
    } else {
        profileUrl = `https://www.instagram.com/${username}/`;
    }

    profiles.push({ username, profileUrl });
  });

  return profiles;
};
