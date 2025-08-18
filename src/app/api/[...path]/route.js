export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORIGIN = process.env.BACKEND_ORIGIN;

const SAFE_REQ_HEADERS = [
  'authorization',
  'content-type',
  'accept',
  'user-agent',
  'accept-language',
  'referer',
  'origin'
];
const SAFE_RES_HEADERS = ['content-type', 'cache-control', 'etag', 'last-modified', 'vary'];

const isAscii = (v) => typeof v === 'string' && /^[\x00-\xFF]*$/.test(v);

function buildTargetUrl(req) {
  const { pathname, search } = req.nextUrl;
  const pathAfterApi = pathname.replace(/^\/api\//, '');
  return `${ORIGIN}/api/${pathAfterApi}${search || ''}`;
}

async function proxy(req) {
  if (!ORIGIN) return new Response('BACKEND_ORIGIN not set', { status: 500 });

  const fwd = new Headers();
  for (const k of SAFE_REQ_HEADERS) {
    const v = req.headers.get(k);
    if (v && isAscii(v)) fwd.set(k, v);
  }

  const hostUrl = new URL(ORIGIN);
  fwd.set('x-forwarded-proto', 'https');
  fwd.set('x-forwarded-host', req.headers.get('host') || '');
  fwd.set('host', hostUrl.host);

  const res = await fetch(buildTargetUrl(req), {
    method: req.method,
    headers: fwd,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
    cache: 'no-store'
  });

  const out = new Headers();
  for (const k of SAFE_RES_HEADERS) {
    const v = res.headers.get(k);
    if (v && isAscii(v)) out.set(k, v);
  }

  return new Response(res.body, { status: res.status, headers: out });
}

export async function GET(req)    { return proxy(req); }
export async function POST(req)   { return proxy(req); }
export async function PUT(req)    { return proxy(req); }
export async function PATCH(req)  { return proxy(req); }
export async function DELETE(req) { return proxy(req); }
export async function OPTIONS(req){ return proxy(req); }
