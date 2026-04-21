const COMMON_TLDS = ['com', 'org', 'net', 'edu', 'gov', 'io'];

function normalizeUrl(input) {
  try {
    const url = new URL(input);
    if (!url.pathname) url.pathname = '/';
    return url.toString();
  } catch {
    return null;
  }
}

function buildCandidates(input) {
  const trimmed = String(input || '').trim().toLowerCase();
  if (!trimmed) return [];

  if (trimmed.startsWith('http')) {
    return [normalizeUrl(trimmed)].filter(Boolean);
  }

  if (trimmed.includes('.')) {
    return [
      normalizeUrl(`https://${trimmed}`),
      normalizeUrl(`https://www.${trimmed.replace(/^www\./, '')}`),
    ].filter(Boolean);
  }

  const guesses = [];
  for (const tld of COMMON_TLDS) {
    guesses.push(`https://www.${trimmed}.${tld}/`);
    guesses.push(`https://${trimmed}.${tld}/`);
  }

  return guesses.map(normalizeUrl).filter(Boolean);
}

async function looksReachable(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return res.ok || [301, 302, 403, 401].includes(res.status);
  } catch {
    return false;
  }
}

// ✅ THIS is the correct Vercel handler
export async function POST(req) {
  try {
    const body = await req.json();
    const input = body.input;

    if (!input) {
      return new Response(JSON.stringify({ error: 'Input required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const candidates = buildCandidates(input);

    for (const candidate of candidates) {
      const ok = await looksReachable(candidate);
      if (ok) {
        return new Response(
          JSON.stringify({
            found: true,
            resolvedUrl: candidate,
            candidatesTried: candidates,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        found: false,
        error: 'No reachable site found',
        candidatesTried: candidates,
      }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('resolve-site error:', err);

    return new Response(
      JSON.stringify({
        error: 'Server crashed',
        details: err.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}