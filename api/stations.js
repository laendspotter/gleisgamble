import { createClient } from 'db-vendo-client';
import { profile } from 'db-vendo-client/p/db/index.js';

const client = createClient(profile, 'zugroulette/1.0');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const locations = await client.locations(query, { results: 8, stops: true, addresses: false, poi: false });
    res.status(200).json({ locations });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
