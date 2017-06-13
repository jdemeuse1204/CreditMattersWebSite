import * as webApi from '../common/webApi';

const cache = {}; // only get request data (obviously!)
const postUrlMap = {}; // map the post to the get request

export function map(getUrl, postUrl) {
  const wrappedGetUrl = wrap(getUrl);
  const wrappedPostUrl = wrap(postUrl);

  postUrlMap[wrappedPostUrl] = wrappedGetUrl;
}

export function postRequest(url, body, options) {
  // bust the cache for the get/post url combo
  const wrappedGetUrl = postUrlMap[wrap(url)];

  if (wrappedGetUrl) {
    // bust the cache for the get so we will refetch 
    // on a get request
    delete cache[wrappedGetUrl];
  }

  return webApi.post(url, body, options).then(response => {
    cache[wrappedGetUrl] = response;
    return response;
  });
}

export function getRequest(url, payload) {

  const wrappedUrl = wrap(url);

  if (cache.hasOwnProperty(wrappedUrl)) {
    return new Promise((resolve) => {
      resolve(cache[wrappedUrl]);
    });
  }

  return webApi.get(url, payload).then(response => {
    cache[wrappedUrl] = response;
    return response;
  });
}

export function bust() {
  for (let prop in cache) {
    if (!cache.hasOwnProperty(prop)) continue;

    delete cache[prop];
  }
}

export function bustOne(url) {
  const wrappedUrl = wrap(url);

  if (!cache.hasOwnProperty(wrappedUrl)) return;

  delete cache[wrappedUrl];
}

export function hasItems() {
  for (let prop in cache) {
    if (!cache.hasOwnProperty(prop)) continue;

    return true;
  }

  return false;
}

function wrap(url) {
  return `[${url}]`;
}

