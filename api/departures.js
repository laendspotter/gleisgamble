export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { stationId, duration } = req.query;
  if (!stationId) return res.status(400).json({ error: 'stationId required' });

  try {
    const { createClient } = await import('db-vendo-client');
    const { profile } = await import('db-vendo-client/p/db/index.js');
    const client = createClient(profile, 'gleisgamble/1.0');

    const departures = await client.departures(stationId, {
      duration: parseInt(duration) || 90,
      when: new Date(),
      results: 80,
      stopovers: false,
    });

    res.status(200).json({ departures });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
