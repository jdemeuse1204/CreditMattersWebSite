let _get = function(key) {
  let item = localStorage.getItem(key);

  return JSON.parse(item || '{}');
};
let _remove = function(key) {
  return localStorage.removeItem(key);
};
let _set = function(data, key) {
  const rawDataString = JSON.stringify(data || '');

  localStorage.setItem(key, rawDataString);
};
let _finalModel = {
  get: _get,
  remove: _remove,
  set: _set
};

export default _finalModel;
