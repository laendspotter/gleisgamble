import { createClient } from 'db-vendo-client';
import { profile } from 'db-vendo-client/p/db/index.js';

const client = createClient(profile, 'zugroulette/1.0');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { stationId, duration } = req.query;
  if (!stationId) return res.status(400).json({ error: 'stationId required' });

  try {
    const when = new Date();
    const departures = await client.departures(stationId, {
      duration: parseInt(duration) || 60,
      when,
      results: 80,
      stopovers: false,
    });

    res.status(200).json({ departures });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
