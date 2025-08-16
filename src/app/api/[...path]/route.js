export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORIGIN = process.env.BACKEND_ORIGIN;

function buildTargetUrl(req, pathSegments) {
  const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
  const url = new URL(req.url);
  return `${ORIGIN}/api/${path}${url.search || ''}`;
}

async function proxy(req, context) {
  if (!ORIGIN) return new Response('BACKEND_ORIGIN not set', { status: 500 });

  const params = await context.params;

  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('x-forwarded-host');
  headers.delete('x-forwarded-proto');

  // 인증 전달 보강
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  const init = {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer(),
    cache: 'no-store',
  };

  const target = buildTargetUrl(req, params?.path);
  const res = await fetch(target, init);

  const buf = await res.arrayBuffer();
  const outHeaders = new Headers(res.headers);
  return new Response(buf, { status: res.status, headers: outHeaders });
}

export async function GET(req, ctx)     { return proxy(req, ctx); }
export async function POST(req, ctx)    { return proxy(req, ctx); }
export async function PUT(req, ctx)     { return proxy(req, ctx); }
export async function PATCH(req, ctx)   { return proxy(req, ctx); }
export async function DELETE(req, ctx)  { return proxy(req, ctx); }
export async function OPTIONS(req, ctx) { return proxy(req, ctx); }
