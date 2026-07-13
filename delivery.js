/* Shared helpers for admin.html / download.html — talks to the phantom-delivery Worker. */
(function () {
  const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  const WORKER_BASE_URL = isLocal
    ? 'http://localhost:8787'
    : 'https://phantom-delivery.colinpeterman.workers.dev';

  const ADMIN_KEY_STORAGE = 'pp_admin_key';

  function getAdminKey() {
    return localStorage.getItem(ADMIN_KEY_STORAGE) || '';
  }

  function setAdminKey(key) {
    localStorage.setItem(ADMIN_KEY_STORAGE, key);
  }

  function clearAdminKey() {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
  }

  function adminFetch(path, options) {
    options = options || {};
    const headers = Object.assign({}, options.headers, { Authorization: 'Bearer ' + getAdminKey() });
    return fetch(WORKER_BASE_URL + path, Object.assign({}, options, { headers }));
  }

  function publicFetch(path, options) {
    return fetch(WORKER_BASE_URL + path, options || {});
  }

  window.PhantomDelivery = {
    WORKER_BASE_URL,
    getAdminKey,
    setAdminKey,
    clearAdminKey,
    adminFetch,
    publicFetch,
  };
})();
