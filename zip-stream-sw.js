// Relays a client-side-generated ZIP stream straight to the browser's native
// download manager, so large "Download All" archives never have to be fully
// buffered in page memory (which crashes big deliveries on Safari/mobile).
// Registered from download.html with scope /__zipstream__/ only — it never
// intercepts normal site navigation.
//
// Flow: download.html posts {type:'start', id} over a MessageChannel, then
// navigates a hidden iframe to /__zipstream__/<id>/<filename>. The fetch
// handler below answers that request with a ReadableStream whose pull()
// asks the page (via the port) for the next chunk and waits for it — real
// pull-based backpressure, so bytes only flow as fast as the browser is
// actually able to write them to disk.

const streams = new Map(); // id -> { port, closed, errored, pendingResolve }

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'start') return;

  const { id } = data;
  const port = event.ports[0];
  const entry = { port, closed: false, errored: null, pendingResolve: null };
  streams.set(id, entry);

  port.onmessage = (e) => {
    const msg = e.data;
    if (msg.type === 'chunk') {
      const resolve = entry.pendingResolve;
      entry.pendingResolve = null;
      if (resolve) resolve({ chunk: new Uint8Array(msg.chunk) });
    } else if (msg.type === 'close') {
      entry.closed = true;
      const resolve = entry.pendingResolve;
      entry.pendingResolve = null;
      if (resolve) resolve({ done: true });
    } else if (msg.type === 'abort') {
      entry.errored = msg.message || 'aborted';
      const resolve = entry.pendingResolve;
      entry.pendingResolve = null;
      if (resolve) resolve({ error: entry.errored });
    }
  };

  port.postMessage({ type: 'ready' });
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const match = url.pathname.match(/^\/__zipstream__\/([^/]+)\/(.+)$/);
  if (!match) return; // not ours — let it pass through untouched

  const id = match[1];
  const entry = streams.get(id);
  if (!entry) {
    event.respondWith(new Response('Not found', { status: 404 }));
    return;
  }

  const filename = decodeURIComponent(match[2]);
  const body = new ReadableStream({
    pull(controller) {
      return new Promise((resolve) => {
        if (entry.closed) { controller.close(); resolve(); return; }
        if (entry.errored) { controller.error(new Error(entry.errored)); resolve(); return; }
        entry.pendingResolve = (result) => {
          if (result.error) controller.error(new Error(result.error));
          else if (result.done) controller.close();
          else controller.enqueue(result.chunk);
          resolve();
        };
        entry.port.postMessage({ type: 'pull' });
      });
    },
    cancel() {
      streams.delete(id);
    },
  });

  event.respondWith(
    new Response(body, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
      },
    })
  );
});
