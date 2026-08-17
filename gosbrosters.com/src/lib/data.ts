import { list } from '@vercel/blob';
import localProjects from '@/data/projects.json';
import localPricing from '@/data/pricing.json';

export async function getProjects() {
  try {
    const { blobs } = await list({ prefix: 'data/projects.json' });
    // Make sure we get an exact match if there are multiple
    const exactMatch = blobs.find(b => b.pathname === 'data/projects.json');
    
    if (exactMatch) {
      // Fetch latest blob content with no-store so admin writes always read fresh data
      const res = await fetch(exactMatch.url, { cache: 'no-store' });
      if (res.ok) {
        return res.json();
      }
    }
  } catch (error) {
    console.error('Error fetching projects from blob:', error);
  }
  
  // Fallback to local file if blob fetch fails or blob doesn't exist yet
  return localProjects;
}

export async function getPricing() {
  try {
    const { blobs } = await list({ prefix: 'data/pricing.json' });
    const exactMatch = blobs.find(b => b.pathname === 'data/pricing.json');
    
    if (exactMatch) {
      // Fetch latest blob content with no-store so admin writes always read fresh data
      const res = await fetch(exactMatch.url, { cache: 'no-store' });
      if (res.ok) {
        return res.json();
      }
    }
  } catch (error) {
    console.error('Error fetching pricing from blob:', error);
  }
  
  // Fallback to local file if blob fetch fails or blob doesn't exist yet
  return localPricing;
}
